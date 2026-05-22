import { Logger } from '@nestjs/common';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { TypedConfigService } from '@common/config/typed-config.service';

const logger = new Logger('Session');

export async function configureSession(
  app: NestExpressApplication,
  config: TypedConfigService,
): Promise<void> {
  const auth = config.auth;
  const appConfig = config.app;
  const isTest = appConfig.nodeEnv === 'test';

  if (appConfig.clusterEnabled && auth.sessionStore === 'memory' && !isTest) {
    throw new Error(
      'CLUSTER_ENABLED requires SESSION_STORE=redis (in-memory sessions are not shared across workers).',
    );
  }

  let store: session.Store | undefined;

  if (auth.sessionStore === 'redis' && !isTest) {
    const client = createClient({ url: auth.sessionRedisUrl });
    client.on('error', (err: Error) => {
      logger.error(`Redis session client: ${err.message}`);
    });
    await client.connect();
    store = new RedisStore({
      client,
      prefix: 'nabeghe:sess:',
    });
    logger.log('Session store: Redis');
  } else {
    logger.log('Session store: memory');
  }

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(
    session({
      name: auth.sessionName,
      secret: auth.sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      store,
      cookie: {
        httpOnly: true,
        secure: auth.sessionCookieSecure,
        sameSite: 'lax',
        maxAge: auth.sessionMaxAgeMs,
      },
    }),
  );
}
