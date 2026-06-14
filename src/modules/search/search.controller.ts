import { Controller, Get, Query, Render, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '@modules/auth/decorator/public.decorator';
import { SearchService } from './search.service';

@Public()
@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search')
  @Render('view/pages/site/search')
  async searchPage(@Query('q') q = '', @Req() req: Request): Promise<object> {
    const query = q.trim();
    const result = query ? await this.searchService.search(query, 12) : { courses: [], articles: [], total: 0 };
    const t = (req as any).res?.locals?.t as (key: string) => string;
    return {
      pageTitle: query ? `${t('page_title_search_for')} "${query}" — ${t('site_name_short')}` : t('page_title_search'),
      seoRobots: 'noindex, follow',
      q: query,
      ...result,
    };
  }

  @Get('api/search')
  async searchApi(@Req() req: Request, @Query('q') q = ''): Promise<object> {
    const query = q.trim();
    if (!query || query.length < 2) {
      return { courses: [], articles: [], total: 0 };
    }
    const result = await this.searchService.search(query, 5);
    const loc = (req as any).res?.locals?.loc as ((v: unknown) => string) | undefined;
    const resolve = (jsonb: Record<string, string> | null | undefined): string => {
      if (!jsonb) return '';
      return loc ? loc(jsonb) : (jsonb['fa'] ?? Object.values(jsonb)[0] ?? '');
    };
    const resolveThumbnail = (thumb: Record<string, string> | null): string | null => {
      if (!thumb) return null;
      const val = loc ? loc(thumb) : (thumb['fa'] ?? Object.values(thumb)[0] ?? null);
      return val || null;
    };
    return {
      total: result.total,
      courses: result.courses.map((c) => ({
        title: resolve(c.title),
        slug: c.slug,
        thumbnail: resolveThumbnail(c.thumbnail),
        category: c.category ? { title: resolve(c.category.title), slug: c.category.slug } : null,
        price: c.price,
        discountPrice: c.discountPrice ?? null,
      })),
      articles: result.articles.map((a) => ({
        title: resolve(a.title),
        slug: a.slug,
        thumbnail: resolveThumbnail(a.thumbnail),
        category: a.category ? { title: resolve(a.category.title), slug: a.category.slug } : null,
        readTime: a.readTime,
      })),
    };
  }
}
