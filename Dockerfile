# ──────────────────────────────────────────────────────────────
# Stage 1 – Builder
# Uses node_modules from the host (already installed) so no
# network access is required during the Docker build.
# ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

COPY package.json pnpm-lock.yaml ./
COPY node_modules ./node_modules

COPY . .

# Build TypeScript → dist/
RUN pnpm run build

# ──────────────────────────────────────────────────────────────
# Stage 2 – Runner
# Full node_modules are kept to avoid needing network for prune.
# ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

# node_modules (full set — prune is skipped to avoid npm downloads)
COPY --from=builder /app/node_modules ./node_modules

# Compiled app
COPY --from=builder /app/dist ./dist

# Static assets served by Express
# bootstrap.ts: join(process.cwd(), 'src', 'common', 'view', 'assets')
COPY --from=builder /app/src/common/view/assets ./src/common/view/assets

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
