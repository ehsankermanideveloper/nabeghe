import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  clusterEnabled: boolean;
  /** 0 = one worker per CPU core */
  clusterWorkers: number;
}

export const getAppConfig = (): AppConfig => ({
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  clusterEnabled: process.env.CLUSTER_ENABLED === 'true',
  clusterWorkers: Number(process.env.CLUSTER_WORKERS ?? 0),
});

export default registerAs('app', getAppConfig);
