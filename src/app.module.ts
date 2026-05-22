import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import cacheConfig from './config/cache.config';
import { AppCacheModule } from '@common/cache/cache.module';
import { createTypeOrmRootOptions } from './database/typeorm-root.options';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoModule } from '@modules/demo/demo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [databaseConfig, cacheConfig],
    }),
    AppCacheModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmRootOptions(configService),
    }),
    DemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
