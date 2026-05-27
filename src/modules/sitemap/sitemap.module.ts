import { Module } from '@nestjs/common';
import { ArticleModule } from '@modules/article/article.module';
import { CourseModule } from '@modules/course/course.module';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';

@Module({
  imports: [CourseModule, ArticleModule],
  controllers: [SitemapController],
  providers: [SitemapService],
})
export class SitemapModule {}
