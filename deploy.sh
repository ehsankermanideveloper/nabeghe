#!/bin/bash
set -e

echo "▶ Pulling latest code..."
git pull

echo "▶ Installing dependencies..."
corepack enable
corepack prepare pnpm@10.28.2 --activate
pnpm install --frozen-lockfile

echo "▶ Building Docker image..."
docker compose build --no-cache

echo "▶ Restarting app..."
docker compose up -d

echo "▶ Cleaning up old images..."
docker image prune -f

echo "✓ Deploy complete — http://$(curl -s ifconfig.me):3000"
