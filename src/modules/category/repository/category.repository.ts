import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { CategoryEntity } from '@modules/category/entity/category.entity';

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    repository: Repository<CategoryEntity>,
  ) {
    super(repository);
  }

  findAllActiveOrdered(): Promise<CategoryEntity[]> {
    return this.findMany({
      where: { isActive: true },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  findBySlugWithChildren(slug: string): Promise<CategoryEntity | null> {
    return this.repository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.children', 'child', 'child.isActive = true')
      .where('c.slug = :slug', { slug })
      .andWhere('c.isActive = true')
      .getOne();
  }
}
