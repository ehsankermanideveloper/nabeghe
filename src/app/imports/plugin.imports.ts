import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import appConfig from '../../config/app.config';
import authConfig from '../../config/auth.config';
import cacheConfig from '../../config/cache.config';
import databaseConfig from '../../config/database.config';
import loggerConfig, { createPinoParams } from '../../config/logger.config';
import { TypedConfigModule } from '@common/config/typed-config.module';
import { TypedConfigService } from '@common/config/typed-config.service';
import { AppCacheModule } from '@common/cache/cache.module';
import { createTypeOrmRootOptions } from '../../database/typeorm-root.options';

export const pluginImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    // `.env` is loaded in `loadEnvFiles()` before Nest boots (see `bootstrap.ts`, `cluster.ts`).
    load: [appConfig, databaseConfig, cacheConfig, loggerConfig, authConfig],
  }),
  TypedConfigModule,
  ThrottlerModule.forRoot([
    { name: 'default', ttl: 60_000, limit: 120 },
  ]),
  LoggerModule.forRootAsync({
    inject: [TypedConfigService],
    useFactory: (config: TypedConfigService) =>
      createPinoParams(config.app, config.logger),
  }),
  AppCacheModule,
  TypeOrmModule.forRootAsync({
    inject: [TypedConfigService],
    useFactory: (config: TypedConfigService) =>
      createTypeOrmRootOptions(config),
  }),
];
