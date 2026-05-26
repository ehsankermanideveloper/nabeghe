import { Injectable, NotFoundException } from '@nestjs/common';
import type { PagedResult } from '@common/repository/base.repository';
import { CategoryService } from '@modules/category/service/category.service';
import type { CategoryEntity } from '@modules/category/entity/category.entity';
import { ArticleQueryDto } from '@modules/article/dto/article-query.dto';
import { ArticleEntity } from '@modules/article/entity/article.entity';
import { ArticleRepository } from '@modules/article/repository/article.repository';

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
  ) {}

  async findPublishedBySlugOrFail(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findPublishedBySlug(slug);
    if (!article) throw new NotFoundException('مقاله یافت نشد');
    return article;
  }

  findLatest(limit = 5): Promise<ArticleEntity[]> {
    return this.articleRepository.findLatestPublished(limit);
  }

  searchPublished(q: string, limit = 6): Promise<ArticleEntity[]> {
    return this.articleRepository.findPublishedPaged({ q, page: 1, limit }).then((r) => r.data);
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
}
