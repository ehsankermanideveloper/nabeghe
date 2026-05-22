import { registerAs } from '@nestjs/config';

export type SessionStoreType = 'memory' | 'redis';

export interface AuthConfig {
  sessionSecret: string;
  sessionName: string;
  sessionStore: SessionStoreType;
  sessionRedisUrl: string;
  sessionMaxAgeMs: number;
  otpCode: string;
  otpTtlMinutes: number;
  otpMaxAttempts: number;
}

export const getAuthConfig = (): AuthConfig => ({
  sessionSecret:
    process.env.SESSION_SECRET ?? 'dev-only-change-in-production-nabeghe',
  sessionName: process.env.SESSION_NAME ?? 'nabeghe.sid',
  sessionStore: (process.env.SESSION_STORE ??
    (process.env.CACHE_STORE === 'redis'
      ? 'redis'
      : 'memory')) as SessionStoreType,
  sessionRedisUrl:
    process.env.SESSION_REDIS_URL ??
    process.env.CACHE_REDIS_URL ??
    'redis://127.0.0.1:6379',
  sessionMaxAgeMs: Number(process.env.SESSION_MAX_AGE_MS ?? 1_209_600_000),
  otpCode: process.env.AUTH_OTP_CODE ?? '252525',
  otpTtlMinutes: Number(process.env.AUTH_OTP_TTL_MINUTES ?? 5),
  otpMaxAttempts: Number(process.env.AUTH_OTP_MAX_ATTEMPTS ?? 5),
});

export default registerAs('auth', getAuthConfig);
