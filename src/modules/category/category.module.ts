import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '@modules/category/entity/category.entity';
import { CategoryApiController } from '@modules/category/controller/category-api.controller';
import { CategoryRepository } from '@modules/category/repository/category.repository';
import { CategorySeedService } from '@modules/category/service/category-seed.service';
import { CategoryService } from '@modules/category/service/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryApiController],
  providers: [CategoryRepository, CategoryService, CategorySeedService],
  exports: [CategoryService],
})
export class CategoryModule {}
