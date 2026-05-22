import { Controller, Get } from '@nestjs/common';
import { Public } from '@modules/auth/decorator/public.decorator';
import type { CategoryMenuItem } from '@modules/category/interfaces/category-menu.interface';
import { CategoryService } from '@modules/category/service/category.service';

@Public()
@Controller('api/categories')
export class CategoryApiController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('menu')
  async menu(): Promise<{ data: CategoryMenuItem[] }> {
    const data = await this.categoryService.getMenuTree();
    return { data };
  }
}
