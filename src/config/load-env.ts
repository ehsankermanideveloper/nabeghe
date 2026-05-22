import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { config } from 'dotenv';
import { validateEnvironment } from './env.validation';

/** Loads `.env.local` then `.env`, then validates env (CLI, cluster, scripts). */
export function loadEnvFiles(): void {
  for (const name of ['.env.local', '.env']) {
    const path = join(process.cwd(), name);
    if (existsSync(path)) {
      config({ path });
    }
  }
  validateEnvironment();
}
