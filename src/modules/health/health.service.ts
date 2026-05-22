import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { createClient } from 'redis';
import { DataSource } from 'typeorm';
import type { CacheConfig } from '../../config/cache.config';

export type ProbeStatus = 'up' | 'down';

export interface HealthProbe {
  status: ProbeStatus;
  message?: string;
}

export interface ReadinessResult {
  status: 'ok' | 'error';
  checks: Record<string, HealthProbe>;
}

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async checkDatabase(): Promise<HealthProbe> {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'up' };
    } catch (err: unknown) {
      return {
        status: 'down',
        message: err instanceof Error ? err.message : 'Database unreachable',
      };
    }
  }

  async checkRedis(): Promise<HealthProbe> {
    const cache = this.configService.getOrThrow<CacheConfig>('cache');
    if (!cache.enabled || cache.store !== 'redis') {
      return { status: 'up' };
    }

    const client = createClient({ url: cache.redisUrl });
    try {
      await client.connect();
      await client.ping();
      return { status: 'up' };
    } catch (err: unknown) {
      return {
        status: 'down',
        message: err instanceof Error ? err.message : 'Redis unreachable',
      };
    } finally {
      await client.quit().catch(() => undefined);
    }
  }

  async getReadiness(): Promise<ReadinessResult> {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const checks = { database, redis };
    const status = Object.values(checks).every((c) => c.status === 'up')
      ? 'ok'
      : 'error';

    return { status, checks };
  }
}
