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

  async set<T>(
    key: string,
    value: T,
    ttlMs = this.cacheConfig.ttlMs,
  ): Promise<void> {
    if (!this.cacheConfig.enabled) return;
    await this.cache.set(key, value, ttlMs);
  }

  async del(key: string): Promise<void> {
    if (!this.cacheConfig.enabled) return;
    await this.cache.del(key);
  }

  async wrap<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs = this.cacheConfig.ttlMs,
  ): Promise<T> {
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
