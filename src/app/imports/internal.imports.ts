import { AdminModule } from '@modules/admin/admin.module';
import { AuthModule } from '@modules/auth/auth.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { ArticleModule } from '@modules/article/article.module';
import { CategoryModule } from '@modules/category/category.module';
import { CourseModule } from '@modules/course/course.module';
import { HealthModule } from '@modules/health/health.module';
import { DemoModule } from '@modules/demo/demo.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { SiteModule } from '@modules/site/site.module';
import { SearchModule } from '@modules/search/search.module';
import { SitemapModule } from '@modules/sitemap/sitemap.module';

export const internalImports = [
  AdminModule,
  NotificationModule,
  HealthModule,
  AuthModule,
  CategoryModule,
  CourseModule,
  ArticleModule,
  SiteModule,
  ProfileModule,
  SearchModule,
  SitemapModule,
  DemoModule,
];
