import { Injectable, NotFoundException } from '@nestjs/common';
import { AppCacheService } from '@common/cache/cache.service';
import type { PagedResult } from '@common/repository/base.repository';
import { CategoryService } from '@modules/category/service/category.service';
import type { CategoryEntity } from '@modules/category/entity/category.entity';
import { ArticleQueryDto } from '@modules/article/dto/article-query.dto';
import { ArticleEntity } from '@modules/article/entity/article.entity';
import { ArticleRepository } from '@modules/article/repository/article.repository';

const LATEST_TTL = 2 * 60_000;

export interface ArticleIndexData {
  articles: ArticleEntity[];
  pagination: PagedResult<ArticleEntity>;
  categories: CategoryEntity[];
  currentCategory: CategoryEntity | null;
}

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly categoryService: CategoryService,
    private readonly cache: AppCacheService,
  ) {}

  async findPublishedBySlugOrFail(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findPublishedBySlug(slug);
    if (!article) throw new NotFoundException('مقاله یافت نشد');
    return article;
  }

  findLatest(limit = 5): Promise<ArticleEntity[]> {
    return this.cache.wrap(
      this.cache.key('article', 'latest', limit),
      () => this.articleRepository.findLatestPublished(limit),
      LATEST_TTL,
    );
  }

  searchPublished(q: string, limit = 6): Promise<ArticleEntity[]> {
    return this.articleRepository
      .findPublishedPaged({ q, page: 1, limit })
      .then((r) => r.data);
  }

  async findIndexData(dto: ArticleQueryDto): Promise<ArticleIndexData> {
    const [pagination, categories] = await Promise.all([
      this.articleRepository.findPublishedPaged({
        q: dto.q,
        category: dto.category,
        tag: dto.tag,
        page: dto.page ?? 1,
        limit: dto.limit ?? 12,
      }),
      this.categoryService.findAllActive(),
    ]);

    const currentCategory = dto.category
      ? (categories.find((c) => c.slug === dto.category) ?? null)
      : null;

    return { articles: pagination.data, pagination, categories, currentCategory };
  }

  incrementViewCount(id: number): Promise<void> {
    return this.articleRepository.incrementViewCount(id);
  }

  findAllPublishedSlugs(): Promise<Pick<ArticleEntity, 'slug' | 'updatedAt'>[]> {
    return this.articleRepository.findAllPublishedSlugs();
  }
}
