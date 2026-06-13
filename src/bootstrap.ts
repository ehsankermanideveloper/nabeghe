import cluster from 'node:cluster';
import compression from 'compression';
import helmet from 'helmet';
import expressLayouts from 'express-ejs-layouts';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import { Logger } from 'nestjs-pino';
import { TypedConfigService } from '@common/config/typed-config.service';
import { loadEnvFiles } from './config/load-env';
import { configureSession } from '@modules/auth/session/configure-session';
import { AppModule } from './app.module';
import { RTL_LOCALES, SUPPORTED_LOCALES } from '@common/enum/locale.enum';

type I18nMap = Record<string, Record<string, string>>;
let i18n: I18nMap = {};
const ASSET_VERSION = Date.now().toString(36);

function loadI18n(): void {
  const locales = ['fa', 'en', 'ps'];
  for (const locale of locales) {
    try {
      const raw = readFileSync(resolve(__dirname, `i18n/${locale}.json`), 'utf8');
      i18n[locale] = JSON.parse(raw) as Record<string, string>;
    } catch {
      i18n[locale] = {};
    }
  }
}

export async function bootstrapApp(): Promise<void> {
  loadEnvFiles();
  loadI18n();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  const config = app.get(TypedConfigService);
  const logger = new NestLogger('Bootstrap');

  await configureSession(app, config);

  // Locale middleware — strips /en or /ps prefix, sets res.locals
  app.use((req: any, res: any, next: any) => {
    const qIdx = (req.url as string).indexOf('?');
    const rawPath = qIdx === -1 ? req.url : (req.url as string).slice(0, qIdx);
    const qs = qIdx === -1 ? '' : (req.url as string).slice(qIdx);
    const match = rawPath.match(/^\/(en|ps)(\/.*)?$/);
    let locale = 'fa';
    if (match && SUPPORTED_LOCALES.includes(match[1])) {
      locale = match[1];
      req.url = (match[2] || '/') + qs;
    }
    res.locals.locale = locale;
    res.locals.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
    res.locals.lp = locale === 'fa' ? '' : `/${locale}`;
    res.locals.assetVersion = ASSET_VERSION;
    res.locals.t = (key: string): string => i18n[locale]?.[key] ?? i18n['fa']?.[key] ?? key;
    res.locals.loc = (jsonb: unknown): string => {
      if (!jsonb) return '';
      if (typeof jsonb === 'string') return jsonb;
      const obj = jsonb as Record<string, string>;
      return obj[locale] ?? obj['fa'] ?? Object.values(obj)[0] ?? '';
    };
    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(compression());
  app.disable('x-powered-by');
  app.set('etag', 'strong');

  if (config.app.nodeEnv === 'production') {
    app.set('trust proxy', 1);
  }
  const staticOptions = { maxAge: '1y', immutable: true };
  app.useStaticAssets(join(process.cwd(), 'src', 'common', 'view', 'assets'), {
    prefix: '/assets/',
    ...staticOptions,
  });

  const httpServer = app.getHttpAdapter().getInstance();
  httpServer.use(expressLayouts);
  httpServer.set('layout', 'view/layout');
  httpServer.set('views', [
    join(__dirname, 'modules'),
    join(__dirname, 'common'),
  ]);
  httpServer.set('view engine', 'ejs');

  if (config.app.nodeEnv === 'production') {
    httpServer.set('view cache', true);
  }

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

  const server = await app.listen(config.app.port, '0.0.0.0');
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;

  const workerTag =
    cluster.isWorker && cluster.worker
      ? ` | worker #${cluster.worker.id} (pid ${process.pid})`
      : ` | pid ${process.pid}`;

  logger.log(
    `HTTP ready on http://0.0.0.0:${config.app.port} [${config.app.nodeEnv}]${workerTag}`,
  );
}
