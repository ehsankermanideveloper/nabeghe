import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { CourseModule } from '@modules/course/course.module';

@Module({
  imports : [CourseModule],
  controllers: [SiteController],
})
export class SiteModule {}
