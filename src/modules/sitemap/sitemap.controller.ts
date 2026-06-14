import { Controller, Get, Header, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '@modules/auth/decorator/public.decorator';
import { SitemapService } from './sitemap.service';

const XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600',
};

@Public()
@Controller()
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  sitemap(@Res() res: Response): void {
    res.send(this.sitemapService.buildSitemapIndex());
  }

  @Get('sitemap-pages.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  sitemapPages(@Res() res: Response): void {
    res.send(this.sitemapService.buildPagesSitemap());
  }

  @Get('sitemap-courses.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  async sitemapCourses(@Res() res: Response): Promise<void> {
    const xml = await this.sitemapService.buildCoursesSitemap();
    res.send(xml);
  }

  @Get('sitemap-blog.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  async sitemapBlog(@Res() res: Response): Promise<void> {
    const xml = await this.sitemapService.buildBlogSitemap();
    res.send(xml);
  }

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=86400')
  robots(@Res() res: Response): void {
    res.send(this.sitemapService.buildRobotsTxt());
  }
}
