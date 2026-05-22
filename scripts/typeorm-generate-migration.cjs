'use strict';

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

function resolveMigrationBasename() {
  const raw =
    process.env.name ?? process.env.NAME ?? process.argv[2] ?? process.argv[3];

  if (!raw?.trim()) {
    console.error(
      'Usage:\n' +
        '  name=my-change pnpm run migration:generate\n' +
        '  pnpm run migration:generate -- my-change\n\n' +
        'Creates: src/database/migrations/<timestamp>-my-change.ts',
    );
    process.exit(1);
  }

  const slug = raw.trim().replace(/\.ts$/i, '');

  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(slug)) {
    console.error(
      'Invalid name: start with a letter; use only letters, numbers, hyphens, underscores.',
    );
    process.exit(1);
  }

  return slug;
}

const basename = resolveMigrationBasename();
const target = path.join(projectRoot, 'src', 'database', 'migrations', basename);

console.log(`Generating migration for: ${target}`);

const r = spawnSync(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  [
    'exec',
    'typeorm',
    'migration:generate',
    target,
    '-d',
    'dist/database/typeorm.data-source.js',
  ],
  { stdio: 'inherit', shell: process.platform === 'win32', cwd: projectRoot },
);

process.exit(r.status ?? 1);
