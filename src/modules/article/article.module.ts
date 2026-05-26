import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '@modules/category/category.module';
import { ArticleViewController } from '@modules/article/controller/article-view.controller';
import { ArticleApiController } from '@modules/article/controller/article-api.controller';
import { ArticleEntity } from '@modules/article/entity/article.entity';
import { ArticleCommentEntity } from '@modules/article/entity/article-comment.entity';
import { ArticleTagEntity } from '@modules/article/entity/article-tag.entity';
import { ArticleRepository } from '@modules/article/repository/article.repository';
import { ArticleCommentRepository } from '@modules/article/repository/article-comment.repository';
import { ArticleTagRepository } from '@modules/article/repository/article-tag.repository';
import { ArticleService } from '@modules/article/service/article.service';
import { ArticleCommentService } from '@modules/article/service/article-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, ArticleCommentEntity, ArticleTagEntity]),
    CategoryModule,
  ],
  controllers: [ArticleViewController, ArticleApiController],
  providers: [
    ArticleRepository,
    ArticleCommentRepository,
    ArticleTagRepository,
    ArticleService,
    ArticleCommentService,
  ],
  exports: [ArticleService, ArticleCommentService],
})
export class ArticleModule {}
