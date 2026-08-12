# Deploying to havensits.com

The app is served at the **domain root** (`https://havensits.com/`). It used to
sit under a `/haven` subpath; that `basePath` was removed, so a proxy that still
mounts the app under `/haven` will 404 every route.

Nothing in this repo configures DNS, TLS, the reverse proxy, or the OAuth
client — those live on the host and in third-party consoles. This document is
the checklist for all four.

> **Verify before you copy.** The origin IP and port below are inferred from
> values that were previously hardcoded in the app (`3.219.64.247` in the mobile
> API client, port `3002` in `mobile/.env.example`). Confirm both against the
> running host before applying anything.

## 1. DNS

At the registrar/DNS provider for `havensits.com` (held under the Persuadio
account):

| Type  | Name  | Value           | TTL |
| ----- | ----- | --------------- | --- |
| A     | `@`   | `3.219.64.247`  | 300 |
| CNAME | `www` | `havensits.com` | 300 |

Keep the TTL low until the cutover is confirmed, then raise it.

Check propagation before moving on — a wrong answer here makes every later step
look broken:

```sh
dig +short havensits.com
dig +short www.havensits.com
```

## 2. Environment variables

Set on the host, then restart the app. `NEXTAUTH_URL` must be the exact public
origin — a mismatch sends OAuth callbacks to the wrong host and breaks sign-in
with no useful error.

```sh
NEXTAUTH_URL="https://havensits.com"
NEXT_PUBLIC_APP_URL="https://havensits.com"
NEXT_PUBLIC_API_URL="https://havensits.com/api"
```

`NEXTAUTH_SECRET`, `JWT_SECRET`, `DATABASE_URL`, and the Stripe keys carry over
unchanged. See `web/.env.example` for the full list.

`NEXT_PUBLIC_*` values are inlined at build time, so change them **before**
`npm run build`, not after.

## 3. Reverse proxy

The app must be proxied at `/`, not `/haven`. An nginx server block:

```nginx
server {
    listen 443 ssl http2;
    server_name havensits.com www.havensits.com;

    ssl_certificate     /etc/letsencrypt/live/havensits.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/havensits.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        'upgrade';
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name havensits.com www.havensits.com;
    return 301 https://havensits.com$request_uri;
}
```

`X-Forwarded-Proto` matters: without it NextAuth builds `http://` callback URLs
behind the TLS terminator and the OAuth handshake fails.

Certificates, if not already issued:

```sh
sudo certbot --nginx -d havensits.com -d www.havensits.com
```

Then `sudo nginx -t && sudo systemctl reload nginx`.

If any old config mounts the app under `/haven`, remove it — with `basePath`
gone, that path no longer resolves.

## 4. Google OAuth

In Google Cloud Console → APIs & Services → Credentials → the OAuth 2.0 client
whose ID is in `GOOGLE_CLIENT_ID`:

- **Authorized redirect URIs** — add:
  `https://havensits.com/api/auth/callback/google`
- **Authorized JavaScript origins** — add: `https://havensits.com`

Leave the old entries in place until the cutover is confirmed, then remove them.
Missing the redirect URI is the single most common cause of a broken launch: the
site loads fine and only Google sign-in fails, with `redirect_uri_mismatch`.

## 5. Deploy

```sh
npm install
cd web && npx prisma generate && npm run build && npm start
```

`prisma generate` is required — the build fails at page-data collection without
a generated client.

## 6. Verify

```sh
# Root serves the marketing page (200, not 404)
curl -sI https://havensits.com/ | head -1

# A route that only exists at root — 404 here means the proxy still mounts /haven
curl -sI https://havensits.com/blog | head -1

# API responds
curl -s https://havensits.com/api/listings | head -c 200

# The old subpath should NOT resolve
curl -sI https://havensits.com/haven/ | head -1
```

Then by hand:

- Sign in with Google — confirm it lands on `/dashboard`, not a 404
- Sign in with email/password
- Visit `/dashboard` while signed out — confirm it redirects to `/login`
  (this guard was inert under the old basePath, so it is newly live)
- Open a blog post and confirm lists and emphasis render

## Mobile

The app defaults to `https://havensits.com/api` and reads `EXPO_PUBLIC_API_URL`
as an override. Point that at a LAN address for local development; leave it
unset for production builds.
