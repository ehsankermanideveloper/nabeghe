import { Injectable } from '@nestjs/common';
import type { CategoryMenuItem } from '@modules/category/interfaces/category-menu.interface';
import { CategoryEntity } from '@modules/category/entity/category.entity';
import { CategoryRepository } from '@modules/category/repository/category.repository';
import { buildCategoryMenuTree } from '@modules/category/util/category-tree.util';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  findAllActive(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAllActiveOrdered();
  }

  findBySlug(slug: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findOne({ where: { slug, isActive: true } });
  }

  async getMenuTree(): Promise<CategoryMenuItem[]> {
    const rows = await this.categoryRepository.findAllActiveOrdered();
    return buildCategoryMenuTree(rows);
  }
}
