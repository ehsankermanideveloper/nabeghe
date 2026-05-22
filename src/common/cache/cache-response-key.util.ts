import type { AppCacheService } from './cache.service';

export function buildCacheResponseKey(
  cache: AppCacheService,
  method: string,
  url: string,
): string {
  const path = url || '/';
  return cache.key('response', method.toUpperCase(), path);
}
