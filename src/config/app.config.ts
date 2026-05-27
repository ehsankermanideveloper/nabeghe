import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  clusterEnabled: boolean;
  /** 0 = one worker per CPU core */
  clusterWorkers: number;
  appUrl: string;
}

export const getAppConfig = (): AppConfig => {
  const env = process.env;
  return {
    port: Number(env.PORT ?? 3000),
    nodeEnv: env.NODE_ENV ?? 'development',
    clusterEnabled: env.CLUSTER_ENABLED === 'true',
    clusterWorkers: Number(env.CLUSTER_WORKERS ?? 0),
    appUrl: (env.APP_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  };
};

export default registerAs('app', getAppConfig);
