import Joi from 'joi';

const booleanString = Joi.string().valid('true', 'false');

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  CLUSTER_ENABLED: booleanString.default('false'),
  CLUSTER_WORKERS: Joi.number().integer().min(0).default(0),

  DATABASE_DRIVER: Joi.string().default('postgres'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USER: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().allow('').default(''),
  DATABASE_NAME: Joi.string().default('nabeghe_core'),
  DATABASE_SYNC: booleanString.default('false'),
  DATABASE_POOL_MAX: Joi.number().integer().min(1).default(10),
  DATABASE_POOL_MIN: Joi.number().integer().min(0).default(2),
  DATABASE_POOL_IDLE_TIMEOUT_MS: Joi.number().integer().min(0).default(30_000),
  DATABASE_POOL_CONNECTION_TIMEOUT_MS: Joi.number()
    .integer()
    .min(0)
    .default(5_000),

  CACHE_ENABLED: booleanString.default('true'),
  CACHE_STORE: Joi.string().valid('memory', 'redis').default('memory'),
  CACHE_TTL_MS: Joi.number().integer().min(0).default(60_000),
  CACHE_PREFIX: Joi.string().default('nabeghe'),
  CACHE_REDIS_URL: Joi.when('CACHE_STORE', {
    is: 'redis',
    then: Joi.string()
      .uri({ scheme: ['redis', 'rediss'] })
      .required(),
    otherwise: Joi.string()
      .uri({ scheme: ['redis', 'rediss'] })
      .optional(),
  }),

  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
    .optional(),

  SESSION_SECRET: Joi.string().min(16).optional(),
  SESSION_NAME: Joi.string().default('nabeghe.sid'),
  SESSION_STORE: Joi.string().valid('memory', 'redis').optional(),
  SESSION_REDIS_URL: Joi.string()
    .uri({ scheme: ['redis', 'rediss'] })
    .optional(),
  SESSION_MAX_AGE_MS: Joi.number().integer().min(60_000).optional(),
  AUTH_OTP_CODE: Joi.string()
    .pattern(/^\d{4,8}$/)
    .default('252525'),
  AUTH_OTP_TTL_MINUTES: Joi.number().integer().min(1).max(60).default(5),
  AUTH_OTP_MAX_ATTEMPTS: Joi.number().integer().min(1).max(20).default(5),
}).unknown(true);

export function validateEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): void {
  const { error } = envSchema.validate(source, {
    abortEarly: false,
    convert: true,
    stripUnknown: false,
  });

  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    throw new Error(`Environment validation failed: ${details}`);
  }
}
