import { buildCacheResponseKey } from './cache-response-key.util';
import type { AppCacheService } from './cache.service';

export async function invalidateCacheResponse(
  cache: AppCacheService,
  method: string,
  url: string,
): Promise<void> {
  await cache.del(buildCacheResponseKey(cache, method, url));
}
