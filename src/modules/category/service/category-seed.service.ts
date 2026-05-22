import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../../../config/app.config';
import { CategoryEntity } from '@modules/category/entity/category.entity';
import { CategoryRepository } from '@modules/category/repository/category.repository';
import { CATEGORY_SEED_TREE } from '@modules/category/seed/category.seed-data';
import type { CategorySeedNode } from '@modules/category/seed/category.seed-data';

@Injectable()
export class CategorySeedService implements OnModuleInit {
  private readonly logger = new Logger(CategorySeedService.name);

  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const env = this.configService.getOrThrow<AppConfig>('app').nodeEnv;
    if (env === 'production') {
      return;
    }

    const count = await this.categoryRepository.count();
    if (count > 0) {
      return;
    }

    await this.seed();
    this.logger.log('Category seed data inserted.');
  }

  async seed(): Promise<void> {
    for (const node of CATEGORY_SEED_TREE) {
      await this.insertNode(node, null);
    }
  }

  private async insertNode(
    node: CategorySeedNode,
    parentId: number | null,
  ): Promise<void> {
    const entity = this.categoryRepository.build({
      parentId,
      title: node.title,
      slug: node.slug,
      sortOrder: node.sortOrder,
      isActive: true,
    });
    const saved = (await this.categoryRepository.save(
      entity,
    )) as CategoryEntity;

    for (const child of node.children ?? []) {
      await this.insertNode(child, saved.id);
    }
  }
}
