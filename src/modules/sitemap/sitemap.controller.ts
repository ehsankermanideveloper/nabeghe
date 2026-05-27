import { Controller, Get, Header, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '@modules/auth/decorator/public.decorator';
import { SitemapService } from './sitemap.service';

@Public()
@Controller()
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  async sitemap(@Res() res: Response): Promise<void> {
    const xml = await this.sitemapService.buildSitemapXml();
    res.send(xml);
  }

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=86400')
  robots(@Res() res: Response): void {
    res.send(this.sitemapService.buildRobotsTxt());
  }
}
