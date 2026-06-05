import { Injectable } from '@nestjs/common';
import { AppCacheService } from '@common/cache/cache.service';
import type { CategoryMenuItem } from '@modules/category/interfaces/category-menu.interface';
import { CategoryEntity } from '@modules/category/entity/category.entity';
import { CategoryRepository } from '@modules/category/repository/category.repository';
import { buildCategoryMenuTree } from '@modules/category/util/category-tree.util';

const MENU_TREE_TTL = 5 * 60_000;
const ALL_ACTIVE_TTL = 5 * 60_000;

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly cache: AppCacheService,
  ) {}

  findAllActive(): Promise<CategoryEntity[]> {
    return this.cache.wrap(
      this.cache.key('category', 'all-active'),
      () => this.categoryRepository.findAllActiveOrdered(),
      ALL_ACTIVE_TTL,
    );
  }

  findBySlug(slug: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findOne({ where: { slug, isActive: true } });
  }

  findBySlugWithChildren(slug: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findBySlugWithChildren(slug);
  }

  getMenuTree(): Promise<CategoryMenuItem[]> {
    return this.cache.wrap(
      this.cache.key('category', 'menu-tree'),
      async () => {
        const rows = await this.categoryRepository.findAllActiveOrdered();
        return buildCategoryMenuTree(rows);
      },
      MENU_TREE_TTL,
    );
  }
}
