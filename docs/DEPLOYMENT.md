# Launching havensits.com on AWS

Starting point: the domain is registered and its Route 53 hosted zone is live
(it delegates to `ns-135.awsdns-16.com`, `ns-671.awsdns-19.net`,
`ns-1070.awsdns-05.org`, `ns-1831.awsdns-36.co.uk`), but it has **no records** —
nothing is deployed and there is no server yet.

## What the app requires

These come from the code, and they rule some hosting options in and out:

| Requirement | Source |
| --- | --- |
| A **Node runtime** | Next.js 14.2.5 — SSR pages, `/api/*` route handlers, `middleware.ts` |
| **PostgreSQL** | Prisma with `provider = "postgresql"` and ~20 models |
| `prisma generate` before build | `next build` fails while collecting page data without it |
| Server-side secrets | `DATABASE_URL`, `NEXTAUTH_*`, `JWT_SECRET`, `GOOGLE_CLIENT_*`, `STRIPE_*` |

> **S3 + CloudFront cannot host this app.** That stack serves static files and
> has no Node origin. It is the right shape for a static site or a domain
> redirect, not for an app with SSR, route handlers, and middleware.

The app is served at the **domain root**. It previously sat under a `/haven`
subpath; that `basePath` was removed, so any host or proxy that mounts it under
a subpath will 404 every route.

## Host: AWS Amplify Hosting

Amplify Hosting runs Next.js SSR on managed Lambda compute, builds from the
repo, provisions the TLS certificate, and manages the Route 53 records for you.

Two pieces of this repo already exist for it:

- **`amplify.yml`** (repo root) — the monorepo build spec. This is an npm
  workspace with the app in `web/`, so the build runs from the repo root
  (`buildPath: '/'`) and the artifacts come from `web/.next`.
- **`postinstall: prisma generate`** in `web/package.json` — the root install
  triggers it, so the client exists before `next build` runs.

### 1. Database

Amplify's SSR compute is managed by AWS and **is not attached to your VPC**, so
a private-subnet RDS instance is unreachable from it. Pick one of:

- **RDS Postgres, publicly accessible**, locked down with a security group and
  forced TLS. Keeps everything in your AWS account.
- **A serverless Postgres** such as Neon or Prisma Postgres, which speaks TLS
  over the public internet and needs no VPC work.

Either way, keep the connection string — it becomes `DATABASE_URL`.

### 2. Create the Amplify app

In the Amplify console → **Create new app** → connect this GitHub repository and
pick the deployment branch.

- Tick **My app is a monorepo** and enter `web` as the app root. Amplify sets
  `AMPLIFY_MONOREPO_APP_ROOT=web` from this.
- Amplify detects Next.js and uses the committed `amplify.yml`, which overrides
  anything configured in the console.

### 3. Environment variables

In **Hosting → Environment variables**:

```sh
DATABASE_URL="postgresql://…"          # from step 1
NEXTAUTH_URL="https://havensits.com"
NEXTAUTH_SECRET="…"                    # openssl rand -base64 32
JWT_SECRET="…"                         # openssl rand -base64 32
GOOGLE_CLIENT_ID="…"
GOOGLE_CLIENT_SECRET="…"
STRIPE_SECRET_KEY="sk_live_…"
STRIPE_PUBLISHABLE_KEY="pk_live_…"
STRIPE_WEBHOOK_SECRET="whsec_…"        # from step 7
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_…"
NEXT_PUBLIC_APP_URL="https://havensits.com"
NEXT_PUBLIC_API_URL="https://havensits.com/api"
```

`NEXT_PUBLIC_*` values are **inlined at build time**, not read at runtime.
Changing one needs a redeploy, not a restart.

`web/.env.example` lists the optional extras (Resend email, S3 uploads).

### 4. Initialise the schema

There is no `prisma/migrations` directory, so the schema is applied with a push
rather than a migration run. From any machine that can reach the database:

```sh
cd web
DATABASE_URL="postgresql://…" npx prisma db push   # create the tables
DATABASE_URL="postgresql://…" npm run db:seed      # optional demo data
```

Do this before the first real traffic — the app expects the tables to exist.

### 5. Connect the domain

In the Amplify app → **Hosting → Custom domains → Add domain**, enter
`havensits.com`. Because the hosted zone is in the same AWS account, Amplify
creates the Route 53 records and requests the ACM certificate itself. Add the
`www` subdomain at the same time.

If the zone were in a different account you would create the records by hand
from the values Amplify displays.

### 6. Google OAuth

Google Cloud Console → APIs & Services → Credentials → the OAuth 2.0 client
matching `GOOGLE_CLIENT_ID`:

- **Authorized redirect URIs**: `https://havensits.com/api/auth/callback/google`
- **Authorized JavaScript origins**: `https://havensits.com`

Missing the redirect URI is the classic broken launch — the site loads fine and
only Google sign-in fails, with `redirect_uri_mismatch`.

### 7. Stripe webhook

Add an endpoint at `https://havensits.com/api/payments/webhook`, then put its
signing secret in `STRIPE_WEBHOOK_SECRET` and redeploy. The route is already
pinned to the Node runtime for signature verification.

## Prisma on Lambda

`schema.prisma` sets:

```prisma
binaryTargets = ["native", "rhel-openssl-3.0.x"]
```

`rhel-openssl-3.0.x` is the query engine for the Node 18+ Lambda runtime behind
Amplify's SSR compute; `native` covers local development. Without the Lambda
target the **build still succeeds** and every server-rendered request fails at
runtime with `Query engine could not be located` — a failure that never appears
in local testing.

Next's output file tracing picks the engine up automatically, so no bundling
configuration is needed.

## Verify

```sh
curl -sI https://havensits.com/             | head -1   # 200
curl -sI https://havensits.com/blog         | head -1   # 200
curl -s  https://havensits.com/api/listings | head -c 200
curl -sI https://havensits.com/haven/       | head -1   # 404 — old subpath is gone
```

Then by hand:

- Sign in with Google — it should land on `/dashboard`, not a 404
- Sign in with email and password
- Visit `/dashboard` signed out — it should redirect to `/login`. This guard was
  inert under the old basePath and is newly live, so exercise it.
- Open a blog post and confirm lists and emphasis render

## Alternatives

**Vercel** — the same app deploys with no AWS-specific pieces: set the root
directory to `web`, add the same environment variables, and point Route 53 at
the records Vercel displays (the `www` CNAME target is project-specific, so take
it from the dashboard rather than copying one). `amplify.yml` is ignored there,
and the Lambda binary target is harmless.

**Cloudflare** is fine as a DNS provider in front of either host — move the
nameservers off Route 53 and recreate the records. If you proxy it, set SSL/TLS
to **Full (strict)** or you get redirect loops. Cloudflare *Workers* as the host
is a bigger change: Prisma cannot use TCP there, so it needs the
`@prisma/adapter-pg` driver adapter, the `driverAdapters` preview flag, and a
rewrite of `web/lib/prisma.ts` away from the shared singleton.

## Mobile

The Expo app defaults to `https://havensits.com/api` and reads
`EXPO_PUBLIC_API_URL` as an override. Point that at a LAN address for local
development; leave it unset for production builds.
