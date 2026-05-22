import cluster from 'node:cluster';
import { randomUUID } from 'node:crypto';
import { registerAs } from '@nestjs/config';
import type { Params } from 'nestjs-pino';
import type { AppConfig } from './app.config';

export interface LoggerConfig {
  level: string;
}

export const getLoggerConfig = (): LoggerConfig => ({
  level:
    process.env.LOG_LEVEL ??
    (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
});

export default registerAs('logger', getLoggerConfig);

export function createPinoParams(appConfig: AppConfig): Params {
  const level = getLoggerConfig().level;
  const isProduction = appConfig.nodeEnv === 'production';
  const isTest = appConfig.nodeEnv === 'test';

  return {
    pinoHttp: {
      level: isTest ? 'silent' : level,
      transport:
        !isProduction && !isTest
          ? {
              target: 'pino-pretty',
              options: { singleLine: true, colorize: true },
            }
          : undefined,
      genReqId: (req, res) => {
        const incoming = req.headers['x-request-id'];
        const id =
          typeof incoming === 'string' && incoming.length > 0
            ? incoming
            : randomUUID();
        res.setHeader('X-Request-Id', id);
        return id;
      },
      customProps: () => ({
        ...(cluster.isWorker && cluster.worker
          ? { workerId: cluster.worker.id, pid: process.pid }
          : { pid: process.pid }),
      }),
      autoLogging: !isTest,
    },
  };
}
