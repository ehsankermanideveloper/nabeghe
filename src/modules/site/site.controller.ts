import { CourseCommentEntity } from '@modules/course/entity/course-comment.entity';
import { CourseEntity } from '@modules/course/entity/course.entity';
import { CourseCommentService } from '@modules/course/service/course-comment.service';
import { CourseService } from '@modules/course/service/course.service';
import { CourseWishlistService } from '@modules/course/service/course-wishlist.service';
import { ArticleEntity } from '@modules/article/entity/article.entity';
import { ArticleService } from '@modules/article/service/article.service';
import { TypedConfigService } from '@common/config/typed-config.service';
import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';

type ReqWithUser = Request & { user?: SessionUserPayload };

@Controller()
export class SiteController {
  constructor(
    private readonly courseCommentService: CourseCommentService,
    private readonly courseService: CourseService,
    private readonly wishlistService: CourseWishlistService,
    private readonly articleService: ArticleService,
    private readonly config: TypedConfigService,
  ) {}

  @Get()
  @Render('view/pages/site/home')
  async home(@Req() req: ReqWithUser, @Res({ passthrough: true }) res: Response): Promise<object> {
    const userId = req.user?.id;
    const [latestCourses, latestComment, latestArticles, wishlistedIds] = await Promise.all([
      this.courseService.findLatest(4),
      this.courseCommentService.getApprovedComments(undefined, 4),
      this.articleService.findLatest(4),
      userId ? this.wishlistService.getWishlistedCourseIds(userId) : Promise.resolve([]),
    ]);
    const t = res.locals.t as (key: string) => string;
    const appUrl = this.config.app.appUrl;
    const siteName = t('site_name');
    const desc = t('site_seo_desc');
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
          name: siteName,
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
      useSwiper: true,
      latestCourses,
      latestComment,
      latestArticles,
      wishlistedIds,
      pageTitle: t('page_title_home'),
      seoDescription: desc,
      seoKeywords: t('site_seo_keywords'),
      seoCanonical: `${appUrl}/`,
      jsonLd,
    };
  }

  @Get('terms')
  @Render('view/pages/site/terms')
  terms(@Res({ passthrough: true }) res: Response): object {
    const t = res.locals.t as (key: string) => string;
    const appUrl = this.config.app.appUrl;
    return {
      pageTitle: t('page_title_terms'),
      seoDescription: t('site_seo_desc'),
      seoCanonical: `${appUrl}/terms`,
      seoRobots: 'noindex, follow',
    };
  }

  @Get('about-us')
  @Render('view/pages/site/about-us')
  aboutUs(@Res({ passthrough: true }) res: Response): object {
    const t = res.locals.t as (key: string) => string;
    const appUrl = this.config.app.appUrl;
    return {
      pageTitle: t('page_title_about'),
      seoDescription: t('site_seo_desc'),
      seoCanonical: `${appUrl}/about-us`,
    };
  }
}
