import { Module } from '@nestjs/common';
import { CourseModule } from '@modules/course/course.module';
import { ArticleModule } from '@modules/article/article.module';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [CourseModule, ArticleModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
