import { Controller, Get, Query, Render } from '@nestjs/common';
import { Public } from '@modules/auth/decorator/public.decorator';
import { SearchService } from './search.service';

@Public()
@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search')
  @Render('view/pages/site/search')
  async searchPage(@Query('q') q = ''): Promise<object> {
    const query = q.trim();
    const result = query ? await this.searchService.search(query, 12) : { courses: [], articles: [], total: 0 };
    return {
      pageTitle: query ? `نتایج جستجو برای "${query}" - لیان امیری` : 'جستجو - لیان امیری',
      q: query,
      ...result,
    };
  }

  @Get('api/search')
  async searchApi(@Query('q') q = ''): Promise<object> {
    const query = q.trim();
    if (!query || query.length < 2) {
      return { courses: [], articles: [], total: 0 };
    }
    const result = await this.searchService.search(query, 5);
    return {
      total: result.total,
      courses: result.courses.map((c) => ({
        title: c.title,
        slug: c.slug,
        thumbnail: c.thumbnail,
        category: c.category ? { title: c.category.title, slug: c.category.slug } : null,
        price: c.price,
        discountPrice: c.discountPrice ?? null,
      })),
      articles: result.articles.map((a) => ({
        title: a.title,
        slug: a.slug,
        thumbnail: a.thumbnail,
        category: a.category ? { title: a.category.title, slug: a.category.slug } : null,
        readTime: a.readTime,
      })),
    };
  }
}
