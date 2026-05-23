import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { CategoryService } from '@modules/category/service/category.service';

@Injectable()
export class CategoryMenuMiddleware implements NestMiddleware {
  constructor(private readonly categoryService: CategoryService) {}

  async use(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.locals.menuCategories = await this.categoryService.getMenuTree();
    } catch {
      res.locals.menuCategories = [];
    }
    next();
  }
}
