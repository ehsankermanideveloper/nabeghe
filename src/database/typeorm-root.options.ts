import type { TypedConfigService } from '@common/config/typed-config.service';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function createTypeOrmRootOptions(
  config: TypedConfigService,
): TypeOrmModuleOptions {
  const appEnv = config.app.nodeEnv;
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

  const db = config.database;
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
