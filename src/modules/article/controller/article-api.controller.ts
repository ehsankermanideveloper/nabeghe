import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@modules/auth/decorator/current-user.decorator';
import { SessionAuthGuard } from '@modules/auth/guard/session-auth.guard';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import { SubmitArticleCommentDto } from '@modules/article/dto/submit-article-comment.dto';
import { ArticleCommentService } from '@modules/article/service/article-comment.service';
import { ArticleWishlistService } from '@modules/article/service/article-wishlist.service';
import { ArticleService } from '@modules/article/service/article.service';

@Controller('api/blog')
@UseGuards(SessionAuthGuard)
export class ArticleApiController {
  constructor(
    private readonly commentService: ArticleCommentService,
    private readonly wishlistService: ArticleWishlistService,
    private readonly articleService: ArticleService,
  ) {}

  @Post(':slug/comments')
  @HttpCode(200)
  async submitComment(
    @Param('slug') slug: string,
    @CurrentUser() user: SessionUserPayload,
    @Body() dto: SubmitArticleCommentDto,
  ) {
    if (!dto.body?.trim()) throw new BadRequestException('متن نظر را وارد کنید');
    await this.commentService.submit(user.id, slug, dto);
    return { message: 'نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده می‌شود.' };
  }

  @Post(':slug/wishlist')
  @HttpCode(200)
  async toggleWishlist(
    @Param('slug') slug: string,
    @CurrentUser() user: SessionUserPayload,
  ) {
    const article = await this.articleService.findPublishedBySlugOrFail(slug);
    const result = await this.wishlistService.toggle(user.id, article.id);
    return {
      message: result.wishlisted ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد',
      ...result,
    };
  }
}
