import { Injectable } from '@nestjs/common';
import { AppCacheService } from '@common/cache/cache.service';
import type { CategoryMenuItem } from '@modules/category/interfaces/category-menu.interface';
import { CategoryRepository } from '@modules/category/repository/category.repository';
import { buildCategoryMenuTree } from '@modules/category/util/category-tree.util';

@Injectable()
export class CategoryService {
  private static readonly MENU_CACHE_KEY = 'categories:menu';

  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly cache: AppCacheService,
  ) {}

  async getMenuTree(): Promise<CategoryMenuItem[]> {
    const key = this.cache.key(CategoryService.MENU_CACHE_KEY);
    return this.cache.wrap(key, async () => {
      const rows = await this.categoryRepository.findAllActiveOrdered();
      return buildCategoryMenuTree(rows);
    });
  }
}
