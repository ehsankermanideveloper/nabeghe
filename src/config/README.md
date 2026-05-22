# Configuration

## Flow

1. **`loadEnvFiles()`** — loads `.env` then `.env.local` (overrides), then **`validateEnvironment()`** (Joi). Call once before Nest boots; `ConfigModule` does not reload `.env` files.
2. **`getXxxConfig()`** in `*.config.ts` — the **only** app-layer readers of `process.env` (besides validation).
3. **`registerAs('xxx', getXxxConfig)`** — registers namespaces in `ConfigModule`.
4. **`ConfigService` / `TypedConfigService`** — use inside Nest (services, factories, bootstrap).

Pre-Nest entry points (`cluster.ts`, TypeORM CLI) use **`loadApplicationConfig()`** — same values as `ConfigService`, without bootstrapping Nest.

## Files

| File | Namespace | Used by |
|------|-----------|---------|
| `app.config.ts` | `app` | bootstrap, cluster |
| `database.config.ts` | `database` | TypeORM Nest + CLI |
| `cache.config.ts` | `cache` | `AppCacheModule` |
| `logger.config.ts` | `logger` | `LoggerModule` (nestjs-pino) |
| `auth.config.ts` | `auth` | session, auth module |
| `application-config.ts` | all | cluster, `typeorm.data-source.ts` |
| `env.validation.ts` | — | `loadEnvFiles()` |

## In application code

```typescript
import { TypedConfigService } from '@common/config/typed-config.service';

@Injectable()
export class MyService {
  constructor(private readonly config: TypedConfigService) {}

  run() {
    const port = this.config.app.port;
    const otp = this.config.auth.otpCode;
  }
}
```

Do **not** read `process.env` in modules, controllers, or services.

## Cluster + DB pool

With `CLUSTER_ENABLED=true`, each worker has its own pool. Keep:

`total_connections ≈ CLUSTER_WORKERS × DATABASE_POOL_MAX`

under your Postgres `max_connections` limit.
