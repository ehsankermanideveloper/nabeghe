import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const expressApp = app as NestExpressApplication;

  expressApp.setBaseViewsDir(join(__dirname, 'modules'));
  expressApp.setViewEngine('ejs');

  expressApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await expressApp.listen(process.env.PORT ?? 3000);
}

void bootstrap().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
