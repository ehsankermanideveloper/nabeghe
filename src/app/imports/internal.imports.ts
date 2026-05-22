import { HealthModule } from '@modules/health/health.module';
import { DemoModule } from '@modules/demo/demo.module';
import { SiteModule } from '@modules/site/site.module';

export const internalImports = [HealthModule, SiteModule, DemoModule];
