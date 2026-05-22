import { bootstrapApp } from './bootstrap';

void bootstrapApp().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
