import { AuthModule } from '@modules/auth/auth.module';
import { CategoryModule } from '@modules/category/category.module';
import { HealthModule } from '@modules/health/health.module';
import { DemoModule } from '@modules/demo/demo.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { SiteModule } from '@modules/site/site.module';

export const internalImports = [
  HealthModule,
  AuthModule,
  CategoryModule,
  SiteModule,
  ProfileModule,
  DemoModule,
];
