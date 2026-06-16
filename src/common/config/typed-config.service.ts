import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../../config/app.config';
import type { AuthConfig } from '../../config/auth.config';
import type { CacheConfig } from '../../config/cache.config';
import type { DatabaseConfig } from '../../config/database.config';
import type { LoggerConfig } from '../../config/logger.config';
import type { NotificationConfig } from '../../config/notification.config';

/** Typed accessors over global `ConfigService` (prefer this over `process.env` in app code). */
@Injectable()
export class TypedConfigService {
  constructor(private readonly configService: ConfigService) {}

  get app(): AppConfig {
    return this.configService.getOrThrow<AppConfig>('app');
  }

  get database(): DatabaseConfig {
    return this.configService.getOrThrow<DatabaseConfig>('database');
  }

  get cache(): CacheConfig {
    return this.configService.getOrThrow<CacheConfig>('cache');
  }

  get logger(): LoggerConfig {
    return this.configService.getOrThrow<LoggerConfig>('logger');
  }

  get auth(): AuthConfig {
    return this.configService.getOrThrow<AuthConfig>('auth');
  }

  get notification(): NotificationConfig {
    return this.configService.getOrThrow<NotificationConfig>('notification');
  }
}
