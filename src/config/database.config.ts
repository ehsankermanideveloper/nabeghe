import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  driver: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
  /** Per Nest worker process — total PG connections ≈ workers × poolMax */
  poolMax: number;
  poolMin: number;
  poolIdleTimeoutMs: number;
  poolConnectionTimeoutMs: number;
}

export const getDatabaseConfig = (): DatabaseConfig => ({
  driver: process.env.DATABASE_DRIVER ?? 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? '',
  name: process.env.DATABASE_NAME ?? 'nabeghe_core',
  synchronize: process.env.DATABASE_SYNC === 'true',
  poolMax: Number(process.env.DATABASE_POOL_MAX ?? 10),
  poolMin: Number(process.env.DATABASE_POOL_MIN ?? 2),
  poolIdleTimeoutMs: Number(
    process.env.DATABASE_POOL_IDLE_TIMEOUT_MS ?? 30_000,
  ),
  poolConnectionTimeoutMs: Number(
    process.env.DATABASE_POOL_CONNECTION_TIMEOUT_MS ?? 5_000,
  ),
});

export default registerAs('database', getDatabaseConfig);
