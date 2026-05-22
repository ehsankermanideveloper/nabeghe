import { SetMetadata } from '@nestjs/common';

export const CACHE_RESPONSE_TTL_KEY = 'cacheResponse:ttlSeconds';

/** Cache JSON response body by HTTP method + URL. TTL in milliseconds. */
export const CacheResponse = (ttlSeconds: number) =>
  SetMetadata(CACHE_RESPONSE_TTL_KEY, ttlSeconds);
