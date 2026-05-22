import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from '../config/database.config';
import { loadEnvFiles } from '../config/load-env';

loadEnvFiles();

const db = getDatabaseConfig();
const compiledEntitiesGlob = join(process.cwd(), 'dist', '**', '*.entity.js');

export default new DataSource({
  type: 'postgres',
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.name,
  synchronize: false,
  migrationsRun: false,
  logging: ['error', 'schema'],
  migrationsTableName: 'typeorm_migrations',
  migrations: [join(__dirname, 'migrations', '*.js')],
  entities: [compiledEntitiesGlob],
});
