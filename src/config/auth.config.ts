import { registerAs } from '@nestjs/config';
import { getAppConfig } from './app.config';
import type { CacheConfig } from './cache.config';
import { getCacheConfig } from './cache.config';

export type SessionStoreType = 'memory' | 'redis';

function resolveSessionStore(input: {
  explicit?: SessionStoreType;
  cacheStore: CacheConfig['store'];
  clusterEnabled: boolean;
  nodeEnv: string;
}): SessionStoreType {
  if (input.explicit) {
    return input.explicit;
  }
  if (input.cacheStore === 'redis') {
    return 'redis';
  }
  if (input.clusterEnabled && input.nodeEnv === 'production') {
    return 'redis';
  }
  return 'memory';
}

export interface AuthConfig {
  sessionSecret: string;
  sessionName: string;
  sessionStore: SessionStoreType;
  sessionRedisUrl: string;
  sessionMaxAgeMs: number;
  /** Set SESSION_COOKIE_SECURE=true only behind HTTPS. */
  sessionCookieSecure: boolean;
  otpCode: string;
  otpTtlMinutes: number;
  otpMaxAttempts: number;
  googleClientId: string | null;
  googleClientSecret: string | null;
}

export const getAuthConfig = (): AuthConfig => {
  const env = process.env;
  const app = getAppConfig();
  const cache = getCacheConfig();

  return {
    sessionSecret:
      env.SESSION_SECRET ?? 'dev-only-change-in-production-nabeghe',
    sessionName: env.SESSION_NAME ?? 'nabeghe.sid',
    sessionStore: resolveSessionStore({
      explicit: env.SESSION_STORE as SessionStoreType | undefined,
      cacheStore: cache.store,
      clusterEnabled: app.clusterEnabled,
      nodeEnv: app.nodeEnv,
    }),
    sessionRedisUrl: env.SESSION_REDIS_URL ?? cache.redisUrl,
    sessionMaxAgeMs: Number(env.SESSION_MAX_AGE_MS ?? 1_209_600_000),
    sessionCookieSecure: env.SESSION_COOKIE_SECURE === 'true',
    otpCode: env.AUTH_OTP_CODE ?? '252525',
    otpTtlMinutes: Number(env.AUTH_OTP_TTL_MINUTES ?? 5),
    otpMaxAttempts: Number(env.AUTH_OTP_MAX_ATTEMPTS ?? 5),
    googleClientId: env.GOOGLE_CLIENT_ID ?? null,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET ?? null,
  };
};

export default registerAs('auth', getAuthConfig);
