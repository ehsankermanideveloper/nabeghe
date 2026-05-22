# Configuration

## Flow

1. **`loadEnvFiles()`** — loads `.env.local` / `.env`, then **`validateEnvironment()`** (Joi in `env.validation.ts`).
2. **`getXxxConfig()`** — reads `process.env` once (single source of defaults).
3. **`registerAs('xxx', getXxxConfig)`** — registers the namespace in `ConfigModule`.
4. **`ConfigService.getOrThrow<XxxConfig>('xxx')`** — used everywhere inside Nest.

## Files

| File | Namespace | Used by |
|------|-----------|---------|
| `app.config.ts` | `app` | `bootstrap.ts`, `cluster.ts`, TypeORM |
| `database.config.ts` | `database` | TypeORM Nest + CLI |
| `cache.config.ts` | `cache` | `AppCacheModule` |
| `logger.config.ts` | `logger` | `LoggerModule` (nestjs-pino) |
| `env.validation.ts` | — | `loadEnvFiles()` / bootstrap |

## Cluster + DB pool

With `CLUSTER_ENABLED=true`, each worker has its own pool. Keep:

`total_connections ≈ CLUSTER_WORKERS × DATABASE_POOL_MAX`

under your Postgres `max_connections` limit.
