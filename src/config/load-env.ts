import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { config } from 'dotenv';
import { validateEnvironment } from './env.validation';

/** Loads `.env` then `.env.local` (local overrides), then validates. */
export function loadEnvFiles(): void {
  const paths = ['.env', '.env.local']
    .map((name) => join(process.cwd(), name))
    .filter((path) => existsSync(path));

  if (paths.length > 0) {
    config({
      path: paths.length === 1 ? paths[0] : paths,
      quiet: true,
    });
  }

  validateEnvironment();
}
