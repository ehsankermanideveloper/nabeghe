import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SubmitArticleCommentDto } from '@modules/article/dto/submit-article-comment.dto';
import { ArticleCommentEntity } from '@modules/article/entity/article-comment.entity';
import { ArticleCommentStatus } from '@modules/article/enum/article-comment-status.enum';
import { ArticleCommentRepository } from '@modules/article/repository/article-comment.repository';
import { ArticleRepository } from '@modules/article/repository/article.repository';

@Injectable()
export class ArticleCommentService {
  constructor(
    private readonly commentRepository: ArticleCommentRepository,
    private readonly articleRepository: ArticleRepository,
  ) {}

  async submit(userId: number, articleSlug: string, dto: SubmitArticleCommentDto): Promise<ArticleCommentEntity> {
    const article = await this.articleRepository.findPublishedBySlug(articleSlug);
    if (!article) throw new NotFoundException('مقاله یافت نشد');

    if (!dto.parentId) {
      const alreadyCommented = await this.commentRepository.hasUserCommented(userId, article.id);
      if (alreadyCommented) throw new BadRequestException('قبلاً نظر ثبت کرده‌اید');
    }

    if (dto.parentId) {
      const parent = await this.commentRepository.findOneById(dto.parentId);
      if (!parent || parent.articleId !== article.id || parent.parentId !== null) {
        throw new BadRequestException('نظر والد معتبر نیست');
      }
    }

    const comment = this.commentRepository.build({
      articleId: article.id,
      userId,
      parentId: dto.parentId ?? null,
      body: dto.body,
      status: ArticleCommentStatus.PENDING,
    });

    return (await this.commentRepository.save(comment)) as ArticleCommentEntity;
  }

  getApprovedComments(articleId: number): Promise<ArticleCommentEntity[]> {
    return this.commentRepository.findApprovedByArticleId(articleId);
  }

  countApproved(articleId: number): Promise<number> {
    return this.commentRepository.countApprovedByArticleId(articleId);
  }
}
