# Launching havensits.com

Starting point: the domain is registered and its Route 53 hosted zone is live
(it delegates to `ns-135.awsdns-16.com`, `ns-671.awsdns-19.net`,
`ns-1070.awsdns-05.org`, `ns-1831.awsdns-36.co.uk`), but it has **no records** —
nothing is deployed and there is no server yet. This document is the path from
that to a live site.

## What the app requires

These constraints come from the code, and they rule some hosting options in and
out:

| Requirement | Why |
| --- | --- |
| A **Node runtime** | Next.js 14.2.5 with SSR pages, `/api/*` route handlers, and `middleware.ts`. Static hosting cannot run any of it. |
| **PostgreSQL** | Prisma with `provider = "postgresql"` and ~20 models. |
| Build-time `prisma generate` | Without it the build fails while collecting page data. |
| Server-side secrets | `DATABASE_URL`, `NEXTAUTH_SECRET`, `JWT_SECRET`, `GOOGLE_CLIENT_*`, `STRIPE_*`. |

> **S3 + CloudFront will not work.** That stack serves static files; it has no
> Node origin. An IAM role scoped to S3/CloudFront/ACM is the right shape for a
> static site or a domain redirect, not for this app.

The app is served at the **domain root**. It used to sit under a `/haven`
subpath; that `basePath` was removed, so any host or proxy that mounts it under
a subpath will 404 every route.

## Recommended path: Vercel + managed Postgres

Vercel builds Next.js as a first-class target — SSR, route handlers, and
middleware work with no configuration — so this is the shortest route to a
working site. The AWS-native alternative is in the last section.

### 1. Create the database

Any managed Postgres works: Neon, Supabase, or RDS. Neon and Supabase have free
tiers and hand you a connection string directly; RDS keeps everything in AWS but
needs VPC and public-access configuration.

Keep the resulting `DATABASE_URL` — it is needed in step 3.

### 2. Import the repository

In Vercel, create a project from this repository and set:

- **Root Directory**: `web` — this is a monorepo with `web/` and `mobile/`
  workspaces; the default (repo root) will not build.
- **Framework Preset**: Next.js (detected automatically).

Prisma's client must be generated before `next build`. Add this to
`web/package.json` so it happens on every deploy:

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

Alternatively set the Vercel build command to
`prisma generate && next build`. Skipping this is the most common first-deploy
failure — the build gets as far as collecting page data and then dies with
`@prisma/client did not initialize yet`.

### 3. Set environment variables

In the Vercel project's **Settings → Environment Variables**:

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
Changing one requires a redeploy, not just a restart.

See `web/.env.example` for the optional extras (Resend email, S3 uploads).

### 4. Initialise the schema

There is no `prisma/migrations` directory, so the schema is applied with a push
rather than a migration run. From a machine with `DATABASE_URL` set:

```sh
cd web
npx prisma db push      # creates the tables
npm run db:seed         # optional: demo users and listings
```

Run this before the first real traffic — the app expects the tables to exist.

### 5. Add the domain in Vercel

In **Settings → Domains**, add `havensits.com`. Vercel will prompt to add `www`
as well; accept.

Vercel then displays the exact DNS records to create. **Use the values it
shows** — in particular the `www` CNAME target is unique per project (it looks
like `d1d4fc829fe7bc7c.vercel-dns-017.com`), so it cannot be guessed or copied
from another project.

### 6. Create the Route 53 records

In the `havensits.com` hosted zone, add what the Vercel dashboard specified.
Currently that is an apex `A` record to Vercel's anycast IP and a `www` CNAME to
the project-specific target:

| Type  | Name  | Value                                  |
| ----- | ----- | -------------------------------------- |
| A     | `@`   | `76.76.21.21`                          |
| CNAME | `www` | *(the exact value from the dashboard)* |

Confirm the apex IP against the dashboard too — Vercel's docs note it may differ
per domain.

Verify propagation:

```sh
dig +short havensits.com
dig +short www.havensits.com
```

Vercel issues the TLS certificate automatically once the records resolve.

### 7. Google OAuth

In Google Cloud Console → APIs & Services → Credentials → the OAuth 2.0 client
matching `GOOGLE_CLIENT_ID`:

- **Authorized redirect URIs**: `https://havensits.com/api/auth/callback/google`
- **Authorized JavaScript origins**: `https://havensits.com`

Missing the redirect URI is the classic broken launch: the site loads perfectly
and only Google sign-in fails, with `redirect_uri_mismatch`.

### 8. Stripe webhook

In the Stripe dashboard, add an endpoint at
`https://havensits.com/api/payments/webhook`, then copy its signing secret into
`STRIPE_WEBHOOK_SECRET` and redeploy. The route is already pinned to the Node
runtime for signature verification.

## Verify

```sh
curl -sI https://havensits.com/        | head -1   # 200
curl -sI https://havensits.com/blog    | head -1   # 200
curl -s  https://havensits.com/api/listings | head -c 200
curl -sI https://havensits.com/haven/  | head -1   # 404 — the old subpath is gone
```

Then by hand:

- Sign in with Google — it should land on `/dashboard`, not a 404
- Sign in with email and password
- Visit `/dashboard` signed out — it should redirect to `/login`. This guard was
  inert under the old basePath and is newly live, so it is worth exercising.
- Open a blog post and confirm lists and emphasis render

## Mobile

The Expo app defaults to `https://havensits.com/api` and reads
`EXPO_PUBLIC_API_URL` as an override. Point that at a LAN address for local
development; leave it unset for production builds.

## AWS-native alternative

To keep hosting inside AWS, the equivalent stack is:

- **AWS Amplify Hosting** — supports Next.js SSR, connects to the repo, and
  integrates with Route 53 for the domain and certificate. Closest equivalent to
  the Vercel path above.
- **App Runner or ECS Fargate** behind an ALB — more control, more setup; point
  Route 53 at the ALB or App Runner domain with an alias record.
- **RDS Postgres** for the database.

The application steps are unchanged: `prisma generate` before build, the same
environment variables, the same OAuth redirect URI, and the same schema push.
Only the host and the shape of the Route 53 record differ — an alias record to
an AWS resource rather than an A record to Vercel.

## Note on the previous revision

An earlier version of this document described an nginx reverse proxy in front of
an origin at `3.219.64.247`, inferred from a value once hardcoded in the mobile
API client. That IP was never verified, and the domain it accompanied
(`havenhousesits.com`) does not resolve at all, so nothing was ever served
there. Disregard that setup.
