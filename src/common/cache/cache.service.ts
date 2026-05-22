import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { buildCacheKey } from './cache-key.util';

@Injectable()
export class AppCacheService {
  private readonly logger = new Logger(AppCacheService.name);
  private readonly prefix: string;
  private readonly defaultTtlMs: number;
  private readonly enabled: boolean;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    configService: ConfigService,
  ) {
    this.prefix = configService.get<string>('cache.prefix', 'nabeghe');
    this.defaultTtlMs = configService.get<number>('cache.ttlMs', 60_000);
    this.enabled = configService.get<boolean>('cache.enabled', true);
  }

  key(...segments: (string | number)[]): string {
    return buildCacheKey(this.prefix, ...segments);
  }

  async get<T>(key: string): Promise<T | undefined> {
    if (!this.enabled) return undefined;
    return this.cache.get<T>(key);
  }

  async set<T>(
    key: string,
    value: T,
    ttlMs = this.defaultTtlMs,
  ): Promise<void> {
    if (!this.enabled) return;
    await this.cache.set(key, value, ttlMs);
  }

  async del(key: string): Promise<void> {
    if (!this.enabled) return;
    await this.cache.del(key);
  }

  /**
   * Cache-aside: return cached value or run factory, store result, then return it.
   */
  async wrap<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs = this.defaultTtlMs,
  ): Promise<T> {
    if (!this.enabled) {
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
    if (!this.enabled) return;
    await this.cache.clear();
  }
}
