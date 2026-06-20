import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { TypedConfigService } from '@common/config/typed-config.service';
import type { CacheConfig } from '../../config/cache.config';
import { buildCacheKey } from './cache-key.util';

@Injectable()
export class AppCacheService {
  private readonly logger = new Logger(AppCacheService.name);
  private readonly cacheConfig: CacheConfig;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    typedConfig: TypedConfigService,
  ) {
    this.cacheConfig = typedConfig.cache;
  }

  key(...segments: (string | number)[]): string {
    return buildCacheKey(this.cacheConfig.prefix, ...segments);
  }

  async get<T>(key: string): Promise<T | undefined> {
    if (!this.cacheConfig.enabled) return undefined;
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlMs = this.cacheConfig.ttlMs): Promise<void> {
    if (!this.cacheConfig.enabled) return;
    await this.cache.set(key, value, ttlMs);
  }

  async del(key: string): Promise<void> {
    if (!this.cacheConfig.enabled) return;
    await this.cache.del(key);
  }

  /**
   * Delete all cache keys whose internal stored key starts with `keyv:{keyPrefix}`.
   * Works for both in-memory (Map) and Redis (SCAN) stores.
   */
  async delByPrefix(keyPrefix: string): Promise<void> {
    if (!this.cacheConfig.enabled) return;

    const stores = (this.cache as unknown as { stores: unknown[] }).stores ?? [];

    for (const store of stores) {
      const keyvStore = (store as { store?: unknown }).store;
      if (!keyvStore) continue;

      const internalPrefix = `keyv:${keyPrefix}`;

      // In-memory store (Map)
      if (keyvStore instanceof Map) {
        const toDelete: string[] = [];
        for (const k of keyvStore.keys()) {
          if (k.startsWith(internalPrefix)) toDelete.push(k);
        }
        for (const k of toDelete) keyvStore.delete(k);
        if (toDelete.length) this.logger.debug(`delByPrefix(${keyPrefix}): removed ${toDelete.length} in-memory keys`);
        continue;
      }

      // Redis store (KeyvRedis) — use SCAN
      const redisClient = (keyvStore as { client?: unknown }).client;
      if (redisClient && typeof (redisClient as { scan?: unknown }).scan === 'function') {
        const pattern = `${internalPrefix}*`;
        const redis = redisClient as {
          scan(cursor: string, opts: { MATCH: string; COUNT: number }): Promise<{ cursor: string; keys: string[] }>;
          del(...keys: string[]): Promise<number>;
        };
        let cursor = '0';
        let total = 0;
        do {
          const result = await redis.scan(cursor, { MATCH: pattern, COUNT: 200 });
          cursor = String(result.cursor);
          if (result.keys.length) {
            await redis.del(...result.keys);
            total += result.keys.length;
          }
        } while (cursor !== '0');
        if (total) this.logger.debug(`delByPrefix(${keyPrefix}): removed ${total} Redis keys`);
      }
    }
  }

  async wrap<T>(key: string, factory: () => Promise<T>, ttlMs = this.cacheConfig.ttlMs): Promise<T> {
    if (!this.cacheConfig.enabled) {
      return factory();
    }

    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      this.logger.debug(`cache hit: ${key}`);
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttlMs);
    this.logger.debug(`cache set: ${key}`);
    return value;
  }

  async clear(): Promise<void> {
    if (!this.cacheConfig.enabled) return;
    await this.cache.clear();
  }
}
