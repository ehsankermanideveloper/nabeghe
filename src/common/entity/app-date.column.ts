import { Column, type ColumnOptions } from 'typeorm';
import { getAppConfig } from '../../config/app.config';

/** `timestamp` on Postgres; `datetime` on sql.js (NODE_ENV=test). */
export function AppDateColumn(
  options?: Omit<ColumnOptions, 'type'>,
): PropertyDecorator {
  const isTest = getAppConfig().nodeEnv === 'test';
  return Column({
    type: isTest ? 'datetime' : 'timestamp',
    ...options,
  });
}
