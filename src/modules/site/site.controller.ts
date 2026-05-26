import { CourseCommentEntity } from '@modules/course/entity/course-comment.entity';
import { CourseEntity } from '@modules/course/entity/course.entity';
import { CourseCommentService } from '@modules/course/service/course-comment.service';
import { CourseService } from '@modules/course/service/course.service';
import { ArticleEntity } from '@modules/article/entity/article.entity';
import { ArticleService } from '@modules/article/service/article.service';
import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class SiteController {
  constructor(
    private readonly courseCommentService: CourseCommentService,
    private readonly courseService: CourseService,
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  @Render('view/pages/site/home')
  async home(): Promise<{ pageTitle: string; latestCourses: CourseEntity[]; latestComment: CourseCommentEntity[]; latestArticles: ArticleEntity[] }> {
    const [latestCourses, latestComment, latestArticles] = await Promise.all([
      this.courseService.findLatest(4),
      this.courseCommentService.getApprovedComments(undefined, 4),
      this.articleService.findLatest(4),
    ]);
    return {
      latestCourses,
      latestComment,
      latestArticles,
      pageTitle: 'آکادمی لیان امیری - صفحه اصلی',
    };
  }

  @Get('terms')
  @Render('view/pages/site/terms')
  terms(): { pageTitle: string } {
    return {
      pageTitle: 'آکادمی لیان امیری - قوانین و مقررات',
    };
  }

  @Get('about-us')
  @Render('view/pages/site/about-us')
  aboutUs(): { pageTitle: string } {
    return {
      pageTitle: 'آکادمی لیان امیری - درباره ما',
    };
  }
}
