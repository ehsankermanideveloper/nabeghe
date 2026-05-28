#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
node node_modules/typeorm/cli.js migration:run -d dist/database/typeorm.data-source.js

echo "[entrypoint] Starting cluster..."
exec node dist/cluster
