import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function createTypeOrmRootOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const isTest = process.env.NODE_ENV === 'test';

  if (isTest) {
    return {
      type: 'sqljs',
      autoSave: false,
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
    };
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    host: configService.get<string>('database.host', 'localhost'),
    port: configService.get<number>('database.port', 5432),
    username: configService.get<string>('database.username', 'postgres'),
    password: configService.get<string>('database.password', ''),
    database: configService.get<string>('database.name', 'nabeghe_core'),
    autoLoadEntities: true,
    synchronize: configService.get<boolean>('database.synchronize', false),
    logging: isProduction ? ['error'] : ['warn', 'error'],
  };
}
