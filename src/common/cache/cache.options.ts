import type { CacheModuleOptions } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import type { CacheConfig } from '../../config/cache.config';

export function createCacheModuleOptions(
  cache: CacheConfig,
): CacheModuleOptions {
  if (cache.store === 'redis') {
    return {
      ttl: cache.ttlMs,
      stores: [createKeyv(cache.redisUrl)],
    };
  }

  return { ttl: cache.ttlMs };
}
