# syntax=docker/dockerfile:1
#
# Haven Housesits — production image for ECS Fargate.
# Multi-stage: install (with prisma generate via postinstall), build to Next's
# standalone output, then copy only that into a slim runtime.

FROM node:20-slim AS base
# openssl is required by the Prisma query engine
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# ─── deps: install workspace dependencies ────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY web/package.json ./web/
# schema must be present: postinstall runs prisma generate
COPY web/prisma ./web/prisma
RUN npm ci

# ─── builder: compile the Next app ───────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/web/node_modules ./web/node_modules
COPY . .
RUN npm run build --workspace=haven-housesits-web

# ─── runner: minimal runtime ─────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs
# standalone already contains the traced node_modules, including the Prisma engine
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/static ./web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/web/public ./web/public
USER nextjs
EXPOSE 3000
CMD ["node", "web/server.js"]
