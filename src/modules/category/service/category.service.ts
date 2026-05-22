import { Injectable } from '@nestjs/common';
import type { CategoryMenuItem } from '@modules/category/interfaces/category-menu.interface';
import { CategoryRepository } from '@modules/category/repository/category.repository';
import { buildCategoryMenuTree } from '@modules/category/util/category-tree.util';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getMenuTree(): Promise<CategoryMenuItem[]> {
    const rows = await this.categoryRepository.findAllActiveOrdered();
    return buildCategoryMenuTree(rows);
  }
}
