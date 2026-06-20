import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '@modules/category/category.module';
import { CourseModule } from '@modules/course/course.module';
import { ArticleModule } from '@modules/article/article.module';
import { AdminGuard } from '@modules/admin/guard/admin.guard';
import { AdminService } from '@modules/admin/service/admin.service';
import { AdminViewController } from '@modules/admin/controller/admin-view.controller';
import { AdminApiController } from '@modules/admin/controller/admin-api.controller';

@Module({
  imports: [TypeOrmModule.forFeature([]), CategoryModule, CourseModule, ArticleModule],
  controllers: [AdminViewController, AdminApiController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}
