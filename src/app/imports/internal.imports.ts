import { AuthModule } from '@modules/auth/auth.module';
import { ArticleModule } from '@modules/article/article.module';
import { CategoryModule } from '@modules/category/category.module';
import { CourseModule } from '@modules/course/course.module';
import { HealthModule } from '@modules/health/health.module';
import { DemoModule } from '@modules/demo/demo.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { SiteModule } from '@modules/site/site.module';
import { SearchModule } from '@modules/search/search.module';

export const internalImports = [
  HealthModule,
  AuthModule,
  CategoryModule,
  CourseModule,
  ArticleModule,
  SiteModule,
  ProfileModule,
  SearchModule,
  DemoModule,
];
