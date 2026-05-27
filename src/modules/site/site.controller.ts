import { CourseCommentEntity } from '@modules/course/entity/course-comment.entity';
import { CourseEntity } from '@modules/course/entity/course.entity';
import { CourseCommentService } from '@modules/course/service/course-comment.service';
import { CourseService } from '@modules/course/service/course.service';
import { ArticleEntity } from '@modules/article/entity/article.entity';
import { ArticleService } from '@modules/article/service/article.service';
import { TypedConfigService } from '@common/config/typed-config.service';
import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class SiteController {
  constructor(
    private readonly courseCommentService: CourseCommentService,
    private readonly courseService: CourseService,
    private readonly articleService: ArticleService,
    private readonly config: TypedConfigService,
  ) {}

  @Get()
  @Render('view/pages/site/home')
  async home(): Promise<object> {
    const [latestCourses, latestComment, latestArticles] = await Promise.all([
      this.courseService.findLatest(4),
      this.courseCommentService.getApprovedComments(undefined, 4),
      this.articleService.findLatest(4),
    ]);
    const appUrl = this.config.app.appUrl;
    const siteName = 'بنیاد لیان امیری';
    const desc = 'بنیاد لیان امیری در سال ۱۳۹۴ با هدف ارتقاء سطح دانش و با شعار «دانش اساس تکامل بشر» تأسیس شد. دوره‌های آموزشی رایگان برای افراد محروم.';
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${appUrl}/#organization`,
          name: siteName,
          url: appUrl,
          description: desc,
        },
        {
          '@type': 'WebSite',
          '@id': `${appUrl}/#website`,
          url: appUrl,
          name: 'آکادمی لیان امیری',
          description: desc,
          publisher: { '@id': `${appUrl}/#organization` },
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${appUrl}/search?q={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    });
    return {
      latestCourses,
      latestComment,
      latestArticles,
      pageTitle: 'آکادمی لیان امیری - صفحه اصلی',
      seoDescription: desc,
      seoKeywords: 'بنیاد لیان امیری, آموزش رایگان, دوره آموزشی, مقاله, بنیاد خیریه',
      seoCanonical: `${appUrl}/`,
      jsonLd,
    };
  }

  @Get('terms')
  @Render('view/pages/site/terms')
  terms(): object {
    const appUrl = this.config.app.appUrl;
    return {
      pageTitle: 'قوانین و مقررات — لیان امیری',
      seoDescription: 'قوانین و مقررات استفاده از خدمات بنیاد لیان امیری.',
      seoCanonical: `${appUrl}/terms`,
      seoRobots: 'noindex, follow',
    };
  }

  @Get('about-us')
  @Render('view/pages/site/about-us')
  aboutUs(): object {
    const appUrl = this.config.app.appUrl;
    return {
      pageTitle: 'درباره بنیاد لیان امیری',
      seoDescription: 'بنیاد لیان امیری در سال ۱۳۹۴ با هدف ارتقاء سطح دانش و با شعار «دانش اساس تکامل بشر» تأسیس شد. دوره‌های آموزشی رایگان برای افراد محروم جامعه.',
      seoCanonical: `${appUrl}/about-us`,
    };
  }
}
