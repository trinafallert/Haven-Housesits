# Launching havensits.com on AWS (ECS Fargate)

Starting point: the domain is registered and its Route 53 hosted zone is live
(it delegates to `ns-135.awsdns-16.com`, `ns-671.awsdns-19.net`,
`ns-1070.awsdns-05.org`, `ns-1831.awsdns-36.co.uk`), but it has **no
records** — nothing is deployed and there is no server yet.

## Why ECS Fargate, not Amplify

An earlier revision of this doc recommended Amplify Hosting. That was wrong
for this app: Amplify's SSR compute is managed by AWS and is **not
VPC-attached**, so it cannot reach a private RDS instance — only a publicly
accessible database. For an app handling accounts and payments, the database
should not be internet-reachable at all.

AWS App Runner would have solved this cleanly (in-VPC egress via a VPC
connector) but **is closed to new customers** as of this writing.

That leaves **ECS on Fargate** behind an Application Load Balancer, with RDS
in private subnets the database never leaves. It is more setup than a
Hosting product, but it is the only remaining AWS option where the database
stays private.

## What's already in the repo

- **`Dockerfile`** (repo root) — multi-stage build. Installs the npm
  workspace (triggering `web`'s `postinstall: prisma generate`), builds
  Next's `output: 'standalone'` bundle, then copies only that into a slim
  `node:20-slim` runtime that runs as a non-root user on port 3000.
- **`.dockerignore`** — excludes `node_modules`, `.next`, `mobile/`, `docs/`.
- **`web/next.config.js`** sets `output: 'standalone'`, which traces and
  bundles only the dependencies each route actually needs — including the
  Prisma `rhel-openssl-3.0.x` engine.
- **`deploy/task-definition.json`** — an ECS task definition template. Every
  `REPLACE_WITH_*` placeholder needs a real ARN or image URI before use.

### Verified locally

The image was built and run end-to-end against a real PostgreSQL instance,
not mocked:

```
docker build -t haven-web .
docker run -p 3000:3000 -e DATABASE_URL=... -e NEXTAUTH_SECRET=... haven-web
```

| Check | Result |
| --- | --- |
| `GET /`, `/blog` | 200 |
| `GET /api/auth/providers`, `/csrf` | 200 |
| `POST /api/auth/register` | 201 |
| Login with the registered user | 200, session cookie set, session carries `id`/`role`/`plan` |
| `GET /dashboard` signed out | 307 → `/login` |
| Container user | `uid=1001(nextjs)`, not root |

## 1. Push the image to ECR

```sh
aws ecr create-repository --repository-name haven-web --region us-east-1

aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin \
    <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

docker build -t haven-web .
docker tag haven-web:latest \
  <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/haven-web:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/haven-web:latest
```

## 2. Network

- A VPC with **public subnets** (for the ALB and NAT) and **private
  subnets** (for the ECS tasks and RDS), across at least two Availability
  Zones.
- A NAT Gateway so tasks in private subnets can reach the internet — needed
  for Google/Stripe API calls and for pulling the image from ECR.
- Security groups: ALB accepts 443/80 from the internet; the ECS task
  security group accepts 3000 from the ALB only; the RDS security group
  accepts 5432 from the ECS task security group only.

## 3. Database

Create RDS PostgreSQL **in the private subnets**, publicly inaccessible,
with the security group above. This is the point of this whole
architecture — keep it that way rather than opening it to `0.0.0.0/0`.

Because it's private, run the initial schema push from something inside the
VPC — a bastion, a one-off Fargate task, or a Cloud9/EC2 instance — not from
a laptop:

```sh
cd web
DATABASE_URL="postgresql://…" npx prisma db push
DATABASE_URL="postgresql://…" npm run db:seed   # optional demo data
```

## 4. Secrets

Store the server-side secrets in AWS Secrets Manager (one secret with JSON
keys, or one secret per value) — `DATABASE_URL`, `NEXTAUTH_SECRET`,
`JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. `deploy/task-definition.json`
references them by ARN under `secrets`, so the values never sit in the task
definition or an env file.

`NEXT_PUBLIC_*` values are **inlined at build time**, not read at runtime —
they're baked into the Docker image via `docker build`, not injected by ECS.
If they change, rebuild and repush the image.

## 5. Register the task definition and create the service

Fill in every `REPLACE_WITH_*` in `deploy/task-definition.json` — the
execution role ARN, task role ARN, ECR image URI, and each secret ARN —
then:

```sh
aws ecs register-task-definition --cli-input-json file://deploy/task-definition.json

aws ecs create-cluster --cluster-name haven

aws ecs create-service \
  --cluster haven \
  --service-name haven-web \
  --task-definition haven-web \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<private-subnet-ids>],securityGroups=[<ecs-sg-id>],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=<target-group-arn>,containerName=haven-web,containerPort=3000"
```

The execution role needs `AmazonECSTaskExecutionRolePolicy` plus
`secretsmanager:GetSecretValue` on the secrets above.

## 6. Load balancer, domain, certificate

- Application Load Balancer in the public subnets, target group pointing at
  the ECS service on port 3000, health check on `/`.
- ACM certificate for `havensits.com` and `www.havensits.com` (DNS
  validation, using the existing Route 53 zone).
- HTTPS listener (443) using that certificate, forwarding to the target
  group; HTTP listener (80) redirecting to HTTPS.
- Route 53: an **A record (alias)** for `havensits.com` pointing at the
  ALB; same for `www`.

## 7. Google OAuth

Google Cloud Console → APIs & Services → Credentials → the OAuth 2.0 client
matching `GOOGLE_CLIENT_ID`:

- **Authorized redirect URIs**: `https://havensits.com/api/auth/callback/google`
- **Authorized JavaScript origins**: `https://havensits.com`

Missing the redirect URI is the classic broken launch — the site loads fine
and only Google sign-in fails, with `redirect_uri_mismatch`.

## 8. Stripe webhook

Add an endpoint at `https://havensits.com/api/payments/webhook`, then put
its signing secret into the `STRIPE_WEBHOOK_SECRET` value in Secrets
Manager and redeploy the service. The route is pinned to the Node runtime
for signature verification, which the container satisfies.

## Verify

```sh
curl -sI https://havensits.com/             | head -1   # 200
curl -sI https://havensits.com/blog         | head -1   # 200
curl -s  https://havensits.com/api/listings | head -c 200
curl -sI https://havensits.com/haven/       | head -1   # 404 — old subpath is gone
```

Then by hand: sign in with Google and with email/password, visit
`/dashboard` signed out and confirm the redirect to `/login`, and open a
blog post to confirm lists and emphasis render.

## Alternatives

**Amplify Hosting or Vercel** are both far less setup, at the cost of a
publicly-reachable database (Amplify) or a database outside AWS entirely
(Vercel + Neon). Either is defensible if a private database isn't a
requirement; this document assumes it is.

**Cloudflare** is fine as a DNS provider in front of any of these — move
the nameservers off Route 53 and recreate the records; set SSL/TLS to
**Full (strict)** if you proxy it. Cloudflare *Workers* as the host is a
bigger change: Prisma cannot use TCP there without the
`@prisma/adapter-pg` driver adapter and a rewrite of `web/lib/prisma.ts`.

## Mobile

The Expo app defaults to `https://havensits.com/api` and reads
`EXPO_PUBLIC_API_URL` as an override. Point that at a LAN address for local
development; leave it unset for production builds.
