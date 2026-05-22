import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypedConfigService } from '@common/config/typed-config.service';
import { createCacheModuleOptions } from './cache.options';
import { AppCacheService } from './cache.service';
import { CacheResponseInterceptor } from './interceptor/cache-response.interceptor';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [TypedConfigService],
      useFactory: (typedConfig: TypedConfigService) =>
        createCacheModuleOptions(typedConfig.cache),
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
