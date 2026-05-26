import { Injectable } from '@nestjs/common';
import { CourseService } from '@modules/course/service/course.service';
import { ArticleService } from '@modules/article/service/article.service';
import { CourseEntity } from '@modules/course/entity/course.entity';
import { ArticleEntity } from '@modules/article/entity/article.entity';

export interface SearchResult {
  courses: CourseEntity[];
  articles: ArticleEntity[];
  total: number;
}

@Injectable()
export class SearchService {
  constructor(
    private readonly courseService: CourseService,
    private readonly articleService: ArticleService,
  ) {}

  async search(q: string, limit = 6): Promise<SearchResult> {
    const [courses, articles] = await Promise.all([
      this.courseService.searchPublished(q, limit),
      this.articleService.searchPublished(q, limit),
    ]);
    return { courses, articles, total: courses.length + articles.length };
  }
}
