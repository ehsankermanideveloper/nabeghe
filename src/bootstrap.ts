import cluster from 'node:cluster';
import compression from 'compression';
import expressLayouts from 'express-ejs-layouts';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from 'nestjs-pino';
import type { AppConfig } from './config/app.config';
import { loadEnvFiles } from './config/load-env';
import { AppModule } from './app.module';

export async function bootstrapApp(): Promise<void> {
  loadEnvFiles();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<AppConfig>('app');
  const logger = new NestLogger('Bootstrap');

  app.use(compression());
  app.disable('x-powered-by');
  app.set('etag', 'strong');

  if (appConfig.nodeEnv === 'production') {
    app.set('trust proxy', 1);
  }

  app.useStaticAssets(join(process.cwd(), 'html', 'assets'), {
    prefix: '/assets/',
  });

  const httpServer = app.getHttpAdapter().getInstance();
  httpServer.use(expressLayouts);
  httpServer.set('layout', 'view/layout');
  httpServer.set('views', [
    join(__dirname, 'modules'),
    join(__dirname, 'common'),
  ]);
  httpServer.set('view engine', 'ejs');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: true,
    }),
  );

  app.enableShutdownHooks();

  const server = await app.listen(appConfig.port, '0.0.0.0');
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;

  const workerTag =
    cluster.isWorker && cluster.worker
      ? ` | worker #${cluster.worker.id} (pid ${process.pid})`
      : ` | pid ${process.pid}`;

  logger.log(
    `HTTP ready on http://0.0.0.0:${appConfig.port} [${appConfig.nodeEnv}]${workerTag}`,
  );
}
