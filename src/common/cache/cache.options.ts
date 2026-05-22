import type { ConfigService } from '@nestjs/config';
import type { CacheModuleOptions } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import type { CacheStoreType } from '../../config/cache.config';

export function createCacheModuleOptions(
  configService: ConfigService,
): CacheModuleOptions {
  const ttl = configService.get<number>('cache.ttlMs', 60_000);
  const store = configService.get<CacheStoreType>('cache.store', 'memory');

  if (store === 'redis') {
    const redisUrl = configService.get<string>('cache.redisUrl');
    if (!redisUrl) {
      throw new Error('CACHE_REDIS_URL is required when CACHE_STORE=redis');
    }
    return {
      ttl,
      stores: [createKeyv(redisUrl)],
    };
  }

  return { ttl };
}
