import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import appConfig, { type AppConfig } from '../../config/app.config';
import cacheConfig from '../../config/cache.config';
import databaseConfig from '../../config/database.config';
import loggerConfig, { createPinoParams } from '../../config/logger.config';
import { AppCacheModule } from '@common/cache/cache.module';
import { createTypeOrmRootOptions } from '../../database/typeorm-root.options';

export const pluginImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env.local', '.env'],
    load: [appConfig, databaseConfig, cacheConfig, loggerConfig],
  }),
  LoggerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      createPinoParams(configService.getOrThrow<AppConfig>('app')),
  }),
  AppCacheModule,
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      createTypeOrmRootOptions(configService),
  }),
];
