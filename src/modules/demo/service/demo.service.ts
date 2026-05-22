import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AppCacheService } from '@common/cache/cache.service';
import { DemoRepository } from '@modules/demo/repository/demo.repository';

@Injectable()
export class DemoService implements OnModuleInit {
  private readonly logger = new Logger(DemoService.name);

  constructor(
    private readonly demoRepository: DemoRepository,
    private readonly cache: AppCacheService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureSampleRow();
  }

  private demoListCacheKey(): string {
    return this.cache.key('demo', 'list', 'home');
  }

  private async ensureSampleRow(): Promise<void> {
    const total = await this.demoRepository.count();
    if (total > 0) return;
    await this.demoRepository.save(
      this.demoRepository.build({ title: 'First demo row — Nabeghe Core MVC' }),
    );
    await this.cache.del(this.demoListCacheKey());
    this.logger.log('Inserted seed row into demos table.');
  }

  listForHome() {
    return this.cache.wrap(this.demoListCacheKey(), () =>
      this.demoRepository.findMany({
        order: { createdAt: 'DESC' },
      }),
    );
  }
}
