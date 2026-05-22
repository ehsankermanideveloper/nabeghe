import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  driver: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
  poolMax: number;
  poolMin: number;
  poolIdleTimeoutMs: number;
  poolConnectionTimeoutMs: number;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  const env = process.env;
  return {
    driver: env.DATABASE_DRIVER ?? 'postgres',
    host: env.DATABASE_HOST ?? 'localhost',
    port: Number(env.DATABASE_PORT ?? 5432),
    username: env.DATABASE_USER ?? 'postgres',
    password: env.DATABASE_PASSWORD ?? '',
    name: env.DATABASE_NAME ?? 'nabeghe_core',
    synchronize: env.DATABASE_SYNC === 'true',
    poolMax: Number(env.DATABASE_POOL_MAX ?? 10),
    poolMin: Number(env.DATABASE_POOL_MIN ?? 2),
    poolIdleTimeoutMs: Number(env.DATABASE_POOL_IDLE_TIMEOUT_MS ?? 30_000),
    poolConnectionTimeoutMs: Number(
      env.DATABASE_POOL_CONNECTION_TIMEOUT_MS ?? 5_000,
    ),
  };
};

export default registerAs('database', getDatabaseConfig);
