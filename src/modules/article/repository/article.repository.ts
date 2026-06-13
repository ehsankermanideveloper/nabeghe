import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, type PagedResult } from '@common/repository/base.repository';
import { ArticleStatus } from '@modules/article/enum/article-status.enum';
import { ArticleEntity } from '@modules/article/entity/article.entity';

export interface ArticleFilter {
  q?: string;
  category?: string;
  tag?: string;
  page: number;
  limit: number;
}

@Injectable()
export class ArticleRepository extends BaseRepository<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    repository: Repository<ArticleEntity>,
  ) {
    super(repository);
  }

  findPublishedBySlug(slug: string): Promise<ArticleEntity | null> {
    return this.findOne({
      where: { slug, status: ArticleStatus.PUBLISHED },
      relations: { author: true, category: true, tags: true },
    });
  }

  findLatestPublished(limit = 5): Promise<ArticleEntity[]> {
    return this.findMany({
      where: { status: ArticleStatus.PUBLISHED },
      relations: { author: true, category: true, tags: true },
      order: { publishedAt: 'DESC' },
      take: limit,
    });
  }

  async findPublishedPaged(filter: ArticleFilter): Promise<PagedResult<ArticleEntity>> {
    const qb = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deletedAt IS NULL');

    if (filter.q) {
      qb.andWhere(
        '(article.title::text ILIKE :q OR article.short_description::text ILIKE :q)',
        { q: `%${filter.q}%` },
      );
    }

    if (filter.category) {
      qb.andWhere('category.slug = :cat', { cat: filter.category });
    }

    if (filter.tag) {
      qb.andWhere('tags.slug = :tag', { tag: filter.tag });
    }

    qb.orderBy('article.publishedAt', 'DESC');

    const safeLimit = Math.max(1, Math.min(filter.limit, 48));
    const safePage = Math.max(1, filter.page);
    const [data, total] = await qb
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit)
      .getManyAndCount();

    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    return { data, total, page: safePage, limit: safeLimit, totalPages, hasNextPage: safePage < totalPages, hasPreviousPage: safePage > 1 };
  }

  incrementViewCount(id: number): Promise<void> {
    return this.repository.query(
      `UPDATE "public"."article" SET "view_count" = "view_count" + 1 WHERE "id" = $1`,
      [id],
    );
  }

  findAllPublishedSlugs(): Promise<Pick<ArticleEntity, 'slug' | 'updatedAt'>[]> {
    return this.repository
      .createQueryBuilder('article')
      .select(['article.slug', 'article.updatedAt'])
      .where('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deletedAt IS NULL')
      .orderBy('article.publishedAt', 'DESC')
      .getMany();
  }
}
