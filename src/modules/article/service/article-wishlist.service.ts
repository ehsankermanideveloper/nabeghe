import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleWishlistEntity } from '@modules/article/entity/article-wishlist.entity';
import { ArticleWishlistRepository } from '@modules/article/repository/article-wishlist.repository';
import { ArticleRepository } from '@modules/article/repository/article.repository';

@Injectable()
export class ArticleWishlistService {
  constructor(
    private readonly wishlistRepository: ArticleWishlistRepository,
    private readonly articleRepository: ArticleRepository,
  ) {}

  async toggle(userId: number, articleId: number): Promise<{ wishlisted: boolean }> {
    const existing = await this.wishlistRepository.findByUserAndArticle(userId, articleId);

    if (existing) {
      await this.wishlistRepository.remove(existing);
      return { wishlisted: false };
    }

    const article = await this.articleRepository.findOneById(articleId);
    if (!article) throw new NotFoundException('مقاله یافت نشد');

    const item = this.wishlistRepository.build({ userId, articleId });
    await this.wishlistRepository.save(item);
    return { wishlisted: true };
  }

  isWishlisted(userId: number, articleId: number): Promise<boolean> {
    return this.wishlistRepository.existsByUserAndArticle(userId, articleId);
  }

  getMyWishlist(userId: number): Promise<ArticleWishlistEntity[]> {
    return this.wishlistRepository.findByUserId(userId);
  }

  getWishlistedArticleIds(userId: number): Promise<number[]> {
    return this.wishlistRepository.getArticleIdsByUserId(userId);
  }
}
