import cluster from 'node:cluster';
import os from 'node:os';
import { Logger } from '@nestjs/common';
import { bootstrapApp } from './bootstrap';
import { getAppConfig } from './config/app.config';
import { loadEnvFiles } from './config/load-env';

loadEnvFiles();

const appConfig = getAppConfig();
const logger = new Logger('Cluster');

function resolveWorkerCount(): number {
  if (appConfig.clusterWorkers > 0) {
    return appConfig.clusterWorkers;
  }
  return os.cpus().length;
}

function runPrimary(): void {
  const workers = resolveWorkerCount();

  logger.log(
    `Primary pid=${process.pid} | spawning ${workers} worker(s) (CLUSTER_WORKERS=${appConfig.clusterWorkers || 'auto'})`,
  );

  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    if (worker.exitedAfterDisconnect) {
      return;
    }
    logger.warn(
      `Worker #${worker.id} (pid ${worker.process.pid}) exited (code=${code}, signal=${signal ?? 'none'}) — restarting`,
    );
    cluster.fork();
  });
}

if (appConfig.clusterEnabled && cluster.isPrimary) {
  runPrimary();
} else {
  void bootstrapApp().catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  });
}
