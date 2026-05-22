import type { ConfigService } from '@nestjs/config';
import type { CacheModuleOptions } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import type { CacheConfig } from '../../config/cache.config';

export function createCacheModuleOptions(
  configService: ConfigService,
): CacheModuleOptions {
  const cache = configService.getOrThrow<CacheConfig>('cache');

  if (cache.store === 'redis') {
    return {
      ttl: cache.ttlMs,
      stores: [createKeyv(cache.redisUrl)],
    };
  }

  return { ttl: cache.ttlMs };
}
