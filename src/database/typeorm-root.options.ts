import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { AppConfig } from '../config/app.config';
import type { DatabaseConfig } from '../config/database.config';

export function createTypeOrmRootOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const appEnv = configService.getOrThrow<AppConfig>('app').nodeEnv;
  const isTest = appEnv === 'test';

  if (isTest) {
    return {
      type: 'sqljs',
      autoSave: false,
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    };
  }

  const db = configService.getOrThrow<DatabaseConfig>('database');
  const isProduction = appEnv === 'production';

  return {
    type: 'postgres',
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.name,
    autoLoadEntities: true,
    synchronize: db.synchronize,
    logging: isProduction ? ['error'] : ['warn', 'error'],
    extra: {
      max: db.poolMax,
      min: db.poolMin,
      idleTimeoutMillis: db.poolIdleTimeoutMs,
      connectionTimeoutMillis: db.poolConnectionTimeoutMs,
    },
  };
}
