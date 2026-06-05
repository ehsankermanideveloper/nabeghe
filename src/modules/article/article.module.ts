import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '@modules/category/category.module';
import { ArticleViewController } from '@modules/article/controller/article-view.controller';
import { ArticleApiController } from '@modules/article/controller/article-api.controller';
import { ArticleEntity } from '@modules/article/entity/article.entity';
import { ArticleCommentEntity } from '@modules/article/entity/article-comment.entity';
import { ArticleTagEntity } from '@modules/article/entity/article-tag.entity';
import { ArticleWishlistEntity } from '@modules/article/entity/article-wishlist.entity';
import { ArticleRepository } from '@modules/article/repository/article.repository';
import { ArticleCommentRepository } from '@modules/article/repository/article-comment.repository';
import { ArticleTagRepository } from '@modules/article/repository/article-tag.repository';
import { ArticleWishlistRepository } from '@modules/article/repository/article-wishlist.repository';
import { ArticleService } from '@modules/article/service/article.service';
import { ArticleCommentService } from '@modules/article/service/article-comment.service';
import { ArticleWishlistService } from '@modules/article/service/article-wishlist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, ArticleCommentEntity, ArticleTagEntity, ArticleWishlistEntity]),
    CategoryModule,
  ],
  controllers: [ArticleViewController, ArticleApiController],
  providers: [
    ArticleRepository,
    ArticleCommentRepository,
    ArticleTagRepository,
    ArticleWishlistRepository,
    ArticleService,
    ArticleCommentService,
    ArticleWishlistService,
  ],
  exports: [ArticleService, ArticleCommentService, ArticleWishlistService],
})
export class ArticleModule {}
