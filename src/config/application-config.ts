import type { AppConfig } from './app.config';
import { getAppConfig } from './app.config';
import type { AuthConfig } from './auth.config';
import { getAuthConfig } from './auth.config';
import type { CacheConfig } from './cache.config';
import { getCacheConfig } from './cache.config';
import type { DatabaseConfig } from './database.config';
import { getDatabaseConfig } from './database.config';
import type { LoggerConfig } from './logger.config';
import { getLoggerConfig } from './logger.config';

/** Snapshot of all registered config namespaces (same values as `ConfigService`). */
export interface ApplicationConfig {
  app: AppConfig;
  database: DatabaseConfig;
  cache: CacheConfig;
  logger: LoggerConfig;
  auth: AuthConfig;
}

/** For cluster, TypeORM CLI, and other entry points before Nest `ConfigService` exists. */
export function loadApplicationConfig(): ApplicationConfig {
  const app = getAppConfig();
  const database = getDatabaseConfig();
  const cache = getCacheConfig();
  const logger = getLoggerConfig();
  const auth = getAuthConfig();
  return { app, database, cache, logger, auth };
}
