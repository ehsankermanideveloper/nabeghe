import { Controller, Get, Param, Query, Render, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from '@modules/auth/decorator/public.decorator';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import { ArticleQueryDto } from '@modules/article/dto/article-query.dto';
import { ArticleCommentService } from '@modules/article/service/article-comment.service';
import { ArticleService } from '@modules/article/service/article.service';
import { ArticleWishlistService } from '@modules/article/service/article-wishlist.service';
import { TypedConfigService } from '@common/config/typed-config.service';

type ReqWithUser = Request & { user?: SessionUserPayload };

@Public()
@Controller('blog')
export class ArticleViewController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: ArticleCommentService,
    private readonly wishlistService: ArticleWishlistService,
    private readonly config: TypedConfigService,
  ) {}

  @Get()
  @Render('view/pages/blog/index')
  async index(@Query() query: ArticleQueryDto, @Req() req: ReqWithUser): Promise<object> {
    const userId = req.user?.id;
    const [{ articles, pagination, categories, currentCategory }, wishlistedIds] =
      await Promise.all([
        this.articleService.findIndexData(query),
        userId ? this.wishlistService.getWishlistedArticleIds(userId) : Promise.resolve([]),
      ]);

    const appUrl = this.config.app.appUrl;
    const catSlug = query.category ? `?category=${query.category}` : '';

    return {
      pageTitle: currentCategory
        ? `${currentCategory.title} — مقالات — لیان امیری`
        : 'مقالات — لیان امیری',
      seoDescription: currentCategory
        ? `مقالات ${currentCategory.title} — آکادمی لیان امیری`
        : 'مقالات آموزشی و تخصصی — آکادمی لیان امیری',
      seoCanonical: `${appUrl}/blog${catSlug}`,
      articles,
      pagination,
      query,
      categories,
      currentCategory,
      wishlistedIds,
    };
  }

  @Get(':slug')
  @Render('view/pages/blog/detail')
  async detail(@Param('slug') slug: string, @Req() req: ReqWithUser, @Res({ passthrough: true }) res: Response): Promise<object> {
    const article = await this.articleService.findPublishedBySlugOrFail(slug);

    void this.articleService.incrementViewCount(article.id);

    const userId = req.user?.id;
    const [comments, commentCount, relatedArticles, isWishlisted] = await Promise.all([
      this.commentService.getApprovedComments(article.id),
      this.commentService.countApproved(article.id),
      this.articleService.findLatest(4),
      userId ? this.wishlistService.isWishlisted(userId, article.id) : Promise.resolve(false),
    ]);

    const related = relatedArticles.filter((a) => a.id !== article.id).slice(0, 3);

    const appUrl = this.config.app.appUrl;
    const articleUrl = `${appUrl}/blog/${article.slug}`;
    const locale: string = res.locals.locale ?? 'fa';
    const rawThumb = article.thumbnail
      ? (article.thumbnail[locale] ?? article.thumbnail['fa'] ?? Object.values(article.thumbnail)[0] ?? null)
      : null;
    const thumbnail = rawThumb
      ? (rawThumb.startsWith('http') ? rawThumb : `${appUrl}${rawThumb}`)
      : null;

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.shortDescription ?? article.title,
      url: articleUrl,
      image: thumbnail,
      datePublished: article.publishedAt?.toISOString() ?? new Date().toISOString(),
      dateModified: article.updatedAt?.toISOString() ?? new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: 'آکادمی لیان امیری',
        '@id': `${appUrl}/#organization`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'آکادمی لیان امیری',
        '@id': `${appUrl}/#organization`,
      },
    });

    return {
      pageTitle: `${article.title} — لیان امیری`,
      seoDescription: article.shortDescription ?? `مقاله ${article.title} — آکادمی لیان امیری`,
      seoCanonical: articleUrl,
      ogType: 'article',
      ogImage: thumbnail,
      jsonLd,
      article,
      comments,
      commentCount,
      related,
      isWishlisted,
    };
  }
}
