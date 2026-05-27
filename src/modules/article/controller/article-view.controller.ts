import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '@modules/auth/decorator/public.decorator';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import { ArticleQueryDto } from '@modules/article/dto/article-query.dto';
import { ArticleCommentService } from '@modules/article/service/article-comment.service';
import { ArticleService } from '@modules/article/service/article.service';
import { TypedConfigService } from '@common/config/typed-config.service';

type ReqWithUser = Request & { user?: SessionUserPayload };

@Public()
@Controller('blog')
export class ArticleViewController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: ArticleCommentService,
    private readonly config: TypedConfigService,
  ) {}

  @Get()
  @Render('view/pages/blog/index')
  async index(@Query() query: ArticleQueryDto, @Req() req: ReqWithUser): Promise<object> {
    const { articles, pagination, categories, currentCategory } =
      await this.articleService.findIndexData(query);

    const appUrl = this.config.app.appUrl;
    const catSlug = query.category ? `?category=${query.category}` : '';

    return {
      pageTitle: currentCategory
        ? `${currentCategory.title} — مقالات — لیان امیری`
        : 'مقالات — لیان امیری',
      seoDescription: currentCategory
        ? `مقالات ${currentCategory.title} — بنیاد لیان امیری`
        : 'مقالات آموزشی و تخصصی — بنیاد لیان امیری',
      seoCanonical: `${appUrl}/blog${catSlug}`,
      articles,
      pagination,
      query,
      categories,
      currentCategory,
    };
  }

  @Get(':slug')
  @Render('view/pages/blog/detail')
  async detail(@Param('slug') slug: string, @Req() req: ReqWithUser): Promise<object> {
    const article = await this.articleService.findPublishedBySlugOrFail(slug);

    void this.articleService.incrementViewCount(article.id);

    const [comments, commentCount, relatedArticles] = await Promise.all([
      this.commentService.getApprovedComments(article.id),
      this.commentService.countApproved(article.id),
      this.articleService.findLatest(4),
    ]);

    const related = relatedArticles.filter((a) => a.id !== article.id).slice(0, 3);

    const appUrl = this.config.app.appUrl;
    const articleUrl = `${appUrl}/blog/${article.slug}`;
    const thumbnail = article.thumbnail
      ? (article.thumbnail.startsWith('http') ? article.thumbnail : `${appUrl}${article.thumbnail}`)
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
        name: 'بنیاد لیان امیری',
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
      seoDescription: article.shortDescription ?? `مقاله ${article.title} — بنیاد لیان امیری`,
      seoCanonical: articleUrl,
      ogType: 'article',
      ogImage: thumbnail,
      jsonLd,
      article,
      comments,
      commentCount,
      related,
    };
  }
}
