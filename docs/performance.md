# Performance & cluster

## Process model

| Script | Entry | When |
|--------|-------|------|
| `pnpm run start:dev` | `main.ts` | Single process, watch mode |
| `pnpm run start:prod` | `cluster.ts` | Multi-worker when `CLUSTER_ENABLED=true` |
| `pnpm run start:prod:single` | `main.ts` | One process only |

`cluster.ts` forks `CLUSTER_WORKERS` processes (or one per CPU if `CLUSTER_WORKERS=0`). Crashed workers are restarted automatically.

## HTTP stack (`bootstrap.ts`)

- **gzip** via `compression`
- **ETag** (`strong`) for cacheable responses
- **`0.0.0.0` bind** for containers / load balancers
- **keep-alive** tuned for reverse proxies (65s / 66s)
- **`trust proxy`** in production (behind Nginx/Traefik)
- **`enableShutdownHooks`** for graceful shutdown
- Production logger: `error`, `warn`, `log` only

## Database

- **pg pool** per worker: `DATABASE_POOL_*` in `.env`
- Use **migrations** (`DATABASE_SYNC=false`) in production
- **Redis cache** (`CACHE_STORE=redis`) shared across workers

## Suggested production `.env`

```env
NODE_ENV=production
CLUSTER_ENABLED=true
CLUSTER_WORKERS=0
DATABASE_POOL_MAX=5
CACHE_STORE=redis
CACHE_REDIS_URL=redis://127.0.0.1:6379
```

With 8 CPU cores and `CLUSTER_WORKERS=0`: 8 workers × 5 pool = 40 DB connections max.
