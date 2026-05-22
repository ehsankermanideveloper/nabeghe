import { Column, type ColumnOptions } from 'typeorm';

/** `timestamp` on Postgres; `datetime` on sql.js (NODE_ENV=test). */
export function AppDateColumn(
  options?: Omit<ColumnOptions, 'type'>,
): PropertyDecorator {
  const isTest = (process.env.NODE_ENV ?? 'development') === 'test';
  return Column({
    type: isTest ? 'datetime' : 'timestamp',
    ...options,
  });
}
