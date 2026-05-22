import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { createCacheModuleOptions } from './cache.options';
import { AppCacheService } from './cache.service';
import { CacheResponseInterceptor } from './interceptor/cache-response.interceptor';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createCacheModuleOptions,
    }),
  ],
  providers: [
    AppCacheService,
    CacheResponseInterceptor,
    { provide: APP_INTERCEPTOR, useClass: CacheResponseInterceptor },
  ],
  exports: [CacheModule, AppCacheService],
})
export class AppCacheModule {}
