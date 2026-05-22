import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@common/filter/all-exceptions.filter';
import { internalImports } from './app/imports/internal.imports';
import { pluginImports } from './app/imports/plugin.imports';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [...pluginImports, ...internalImports],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
