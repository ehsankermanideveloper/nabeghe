# Cache (`AppCacheModule`)

Global cache layer on top of `@nestjs/cache-manager` (cache-manager v7 + Keyv).

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `CACHE_ENABLED` | `true` | Set `false` to bypass cache reads/writes |
| `CACHE_STORE` | `memory` | `memory` or `redis` |
| `CACHE_TTL_MS` | `60000` | Default TTL for `AppCacheService.set` / `wrap` |
| `CACHE_PREFIX` | `nabeghe` | Key prefix for `AppCacheService.key()` |
| `CACHE_REDIS_URL` | `redis://127.0.0.1:6379` | Used when `CACHE_STORE=redis` |

## `@CacheResponse(ttlMs)`

Decorator for controllers. A global interceptor caches the **serialized response body** using key:

`{prefix}:response:{METHOD}:{originalUrl}`

Also sets `Cache-Control: public, max-age=…` from `ttlMs`.

```typescript
import { CacheResponse } from '@common/cache/decorator/cache-response.decorator';

@Get('menu')
@CacheResponse(300_000) // 5 minutes
async menu() {
  return { data: await this.categoryService.getMenuTree() };
}
```

Invalidate after data changes:

```typescript
import { invalidateCacheResponse } from '@common/cache/invalidate-cache-response';

await invalidateCacheResponse(this.cache, 'GET', '/api/categories/menu');
```

## `AppCacheService` (manual keys)

```typescript
import { AppCacheService } from '@common/cache/cache.service';

@Injectable()
export class MyService {
  constructor(private readonly cache: AppCacheService) {}

  async load() {
    return this.cache.wrap(
      this.cache.key('my-module', 'list'),
      () => this.repository.findMany(),
      30_000,
    );
  }

  async afterUpdate() {
    await this.cache.del(this.cache.key('my-module', 'list'));
  }
}
```

Redis in production, in-memory for local dev and e2e tests (`CACHE_STORE=memory`).
