import { Controller, Get } from '@nestjs/common';
import { CacheResponse } from '@common/cache/decorator/cache-response.decorator';
import { Public } from '@modules/auth/decorator/public.decorator';
import type { CategoryMenuItem } from '@modules/category/interfaces/category-menu.interface';
import { CategoryService } from '@modules/category/service/category.service';

@Public()
@Controller('api/categories')
export class CategoryApiController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('menu')
  @CacheResponse(300)
  async menu(): Promise<{ data: CategoryMenuItem[] }> {
    const data = await this.categoryService.getMenuTree();
    return { data };
  }
}
