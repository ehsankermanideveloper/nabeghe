import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

for (const name of ['.env.local', '.env']) {
  const p = join(process.cwd(), name);
  if (existsSync(p)) {
    config({ path: p });
  }
}

const compiledEntitiesGlob = join(process.cwd(), 'dist', '**', '*.entity.js');

/**
 * Postgres-only datasource for TypeORM CLI (migration commands).
 * Always build the project before running CLI commands so compiled entity JS exists under dist/.
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? '',
  database: process.env.DATABASE_NAME ?? 'nabeghe_core',
  synchronize: false,
  migrationsRun: false,
  logging: ['error', 'schema'],
  migrationsTableName: 'typeorm_migrations',
  migrations: [join(__dirname, 'migrations', '*.js')],
  entities: [compiledEntitiesGlob],
});
