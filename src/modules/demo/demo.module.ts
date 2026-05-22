import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoEntity } from '@modules/demo/entity/demo.entity';
import { DemoController } from '@modules/demo/controller/demo.controller';
import { DemoService } from '@modules/demo/service/demo.service';
import { DemoRepository } from '@modules/demo/repository/demo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DemoEntity])],
  controllers: [DemoController],
  providers: [DemoRepository, DemoService],
  exports: [DemoService],
})
export class DemoModule {}
