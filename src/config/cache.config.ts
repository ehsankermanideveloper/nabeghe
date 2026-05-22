import { registerAs } from '@nestjs/config';

export type CacheStoreType = 'memory' | 'redis';

export interface CacheConfig {
  enabled: boolean;
  store: CacheStoreType;
  ttlMs: number;
  prefix: string;
  redisUrl: string;
}

export const getCacheConfig = (): CacheConfig => {
  const env = process.env;
  return {
    enabled: env.CACHE_ENABLED !== 'false',
    store: (env.CACHE_STORE ?? 'memory') as CacheStoreType,
    ttlMs: Number(env.CACHE_TTL_MS ?? 60_000),
    prefix: env.CACHE_PREFIX ?? 'nabeghe',
    redisUrl: env.CACHE_REDIS_URL ?? 'redis://127.0.0.1:6379',
  };
};

export default registerAs('cache', getCacheConfig);
