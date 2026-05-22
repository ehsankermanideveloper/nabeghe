import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  driver: process.env.DATABASE_DRIVER ?? 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? '',
  name: process.env.DATABASE_NAME ?? 'nabeghe_core',
  synchronize: process.env.DATABASE_SYNC === 'true',
}));
