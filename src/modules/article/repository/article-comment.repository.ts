import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { ArticleCommentStatus } from '@modules/article/enum/article-comment-status.enum';
import { ArticleCommentEntity } from '@modules/article/entity/article-comment.entity';

@Injectable()
export class ArticleCommentRepository extends BaseRepository<ArticleCommentEntity> {
  constructor(
    @InjectRepository(ArticleCommentEntity)
    repository: Repository<ArticleCommentEntity>,
  ) {
    super(repository);
  }

  findApprovedByArticleId(articleId: number): Promise<ArticleCommentEntity[]> {
    return this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect(
        'comment.replies',
        'reply',
        'reply.status = :status AND reply.deletedAt IS NULL',
        { status: ArticleCommentStatus.APPROVED },
      )
      .leftJoinAndSelect('reply.user', 'replyUser')
      .where('comment.articleId = :articleId', { articleId })
      .andWhere('comment.status = :status', { status: ArticleCommentStatus.APPROVED })
      .andWhere('comment.parentId IS NULL')
      .andWhere('comment.deletedAt IS NULL')
      .orderBy('comment.createdAt', 'ASC')
      .getMany();
  }

  hasUserCommented(userId: number, articleId: number): Promise<boolean> {
    return this.createQueryBuilder('comment')
      .where('comment.userId = :userId', { userId })
      .andWhere('comment.articleId = :articleId', { articleId })
      .andWhere('comment.parentId IS NULL')
      .andWhere('comment.deletedAt IS NULL')
      .getExists();
  }

  countApprovedByArticleId(articleId: number): Promise<number> {
    return this.createQueryBuilder('comment')
      .where('comment.articleId = :articleId', { articleId })
      .andWhere('comment.status = :status', { status: ArticleCommentStatus.APPROVED })
      .andWhere('comment.deletedAt IS NULL')
      .getCount();
  }
}
