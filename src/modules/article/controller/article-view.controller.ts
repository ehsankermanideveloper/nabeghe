import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '@modules/auth/decorator/public.decorator';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import { ArticleQueryDto } from '@modules/article/dto/article-query.dto';
import { ArticleCommentService } from '@modules/article/service/article-comment.service';
import { ArticleService } from '@modules/article/service/article.service';

type ReqWithUser = Request & { user?: SessionUserPayload };

@Public()
@Controller('blog')
export class ArticleViewController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: ArticleCommentService,
  ) {}

  @Get()
  @Render('view/pages/blog/index')
  async index(@Query() query: ArticleQueryDto, @Req() req: ReqWithUser): Promise<object> {
    const { articles, pagination, categories, currentCategory } =
      await this.articleService.findIndexData(query);

    return {
      pageTitle: currentCategory
        ? `${currentCategory.title} — مقالات — لیان امیری`
        : 'مقالات — لیان امیری',
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

    return {
      pageTitle: `${article.title} — لیان امیری`,
      article,
      comments,
      commentCount,
      related,
    };
  }
}
