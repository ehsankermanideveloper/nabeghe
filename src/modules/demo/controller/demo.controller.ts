import { Controller, Get, Render } from '@nestjs/common';
import { DemoService } from '@modules/demo/service/demo.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get()
  @Render('demo/view/index')
  async index(): Promise<{
    pageTitle: string;
    title: string;
    items: { id: number; title: string; createdAt: Date }[];
  }> {
    const rows = await this.demoService.listForHome();
    return {
      pageTitle: 'نابغه — Demo',
      title: 'Demo — module-based MVC',
      items: rows.map((r) => ({
        id: r.id,
        title: r.title,
        createdAt: r.createdAt,
      })),
    };
  }
}
