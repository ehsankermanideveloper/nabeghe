import { CourseCommentEntity } from '@modules/course/entity/course-comment.entity';
import { CourseCommentService } from '@modules/course/service/course-comment.service';
import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class SiteController {
  constructor(
    private readonly courseCommentService: CourseCommentService
  ) { }
  @Get()
  @Render('view/pages/site/home')
 async home(): Promise<{ pageTitle: string , latestComment : CourseCommentEntity[] }> {
    return {
      latestComment: await this.courseCommentService.getApprovedComments(undefined, 4),
      pageTitle: 'آموزشی نابغه - صفحه اصلی',
    };
  }

  @Get('terms')
  @Render('view/pages/site/terms')
  terms(): { pageTitle: string } {
    return {
      pageTitle: 'آموزشی نابغه - قوانین و مقررات',
    };
  }

  @Get('about-us')
  @Render('view/pages/site/about-us')
  aboutUs(): { pageTitle: string } {
    return {
      pageTitle: 'آموزشی نابغه - درباره ما',
    };
  }
}
