import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { ArticleWishlistEntity } from '@modules/article/entity/article-wishlist.entity';

@Injectable()
export class ArticleWishlistRepository extends BaseRepository<ArticleWishlistEntity> {
  constructor(
    @InjectRepository(ArticleWishlistEntity)
    repository: Repository<ArticleWishlistEntity>,
  ) {
    super(repository);
  }

  findByUserAndArticle(userId: number, articleId: number): Promise<ArticleWishlistEntity | null> {
    return this.findOne({ where: { userId, articleId } });
  }

  existsByUserAndArticle(userId: number, articleId: number): Promise<boolean> {
    return this.repository.exists({ where: { userId, articleId } });
  }

  findByUserId(userId: number): Promise<ArticleWishlistEntity[]> {
    return this.findMany({
      where: { userId },
      relations: { article: { category: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async getArticleIdsByUserId(userId: number): Promise<number[]> {
    const rows = await this.findMany({ where: { userId }, select: { articleId: true } });
    return rows.map((r) => r.articleId);
  }
}
