import { registerAs } from '@nestjs/config';

export type CacheStoreType = 'memory' | 'redis';

export default registerAs('cache', () => ({
  enabled: process.env.CACHE_ENABLED !== 'false',
  store: (process.env.CACHE_STORE ?? 'memory') as CacheStoreType,
  ttlMs: Number(process.env.CACHE_TTL_MS ?? 60_000),
  prefix: process.env.CACHE_PREFIX ?? 'nabeghe',
  redisUrl: process.env.CACHE_REDIS_URL ?? 'redis://127.0.0.1:6379',
}));
