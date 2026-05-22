import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { AppConfig } from '../../../config/app.config';
import type { AuthConfig } from '../../../config/auth.config';

const logger = new Logger('Session');

export async function configureSession(
  app: NestExpressApplication,
  configService: ConfigService,
): Promise<void> {
  const auth = configService.getOrThrow<AuthConfig>('auth');
  const appConfig = configService.getOrThrow<AppConfig>('app');
  const isProduction = appConfig.nodeEnv === 'production';
  const isTest = appConfig.nodeEnv === 'test';

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
        secure: isProduction,
        sameSite: 'lax',
        maxAge: auth.sessionMaxAgeMs,
      },
    }),
  );
}
