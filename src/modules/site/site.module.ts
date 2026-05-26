import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { ArticleModule } from '@modules/article/article.module';
import { CourseModule } from '@modules/course/course.module';

@Module({
  imports: [CourseModule, ArticleModule],
  controllers: [SiteController],
})
export class SiteModule {}
