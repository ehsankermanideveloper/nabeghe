import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createCacheModuleOptions } from './cache.options';
import { AppCacheService } from './cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createCacheModuleOptions,
    }),
  ],
  providers: [AppCacheService],
  exports: [CacheModule, AppCacheService],
})
export class AppCacheModule {}
