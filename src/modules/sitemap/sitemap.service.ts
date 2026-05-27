import { Injectable } from '@nestjs/common';
import { TypedConfigService } from '@common/config/typed-config.service';
import { CourseService } from '@modules/course/service/course.service';
import { ArticleService } from '@modules/article/service/article.service';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

@Injectable()
export class SitemapService {
  constructor(
    private readonly config: TypedConfigService,
    private readonly courseService: CourseService,
    private readonly articleService: ArticleService,
  ) {}

  async buildSitemapXml(): Promise<string> {
    const appUrl = this.config.app.appUrl;

    const staticUrls: SitemapUrl[] = [
      { loc: `${appUrl}/`, changefreq: 'daily', priority: '1.0' },
      { loc: `${appUrl}/courses`, changefreq: 'daily', priority: '0.9' },
      { loc: `${appUrl}/blog`, changefreq: 'daily', priority: '0.9' },
      { loc: `${appUrl}/about-us`, changefreq: 'monthly', priority: '0.6' },
      { loc: `${appUrl}/terms`, changefreq: 'monthly', priority: '0.4' },
    ];

    const [courseSlugs, articleSlugs] = await Promise.all([
      this.courseService.findAllPublishedSlugs(),
      this.articleService.findAllPublishedSlugs(),
    ]);

    const courseUrls: SitemapUrl[] = courseSlugs.map((c) => ({
      loc: `${appUrl}/courses/${c.slug}`,
      lastmod: c.updatedAt ? new Date(c.updatedAt).toISOString().split('T')[0] : undefined,
      changefreq: 'weekly',
      priority: '0.8',
    }));

    const articleUrls: SitemapUrl[] = articleSlugs.map((a) => ({
      loc: `${appUrl}/blog/${a.slug}`,
      lastmod: a.updatedAt ? new Date(a.updatedAt).toISOString().split('T')[0] : undefined,
      changefreq: 'weekly',
      priority: '0.8',
    }));

    const allUrls = [...staticUrls, ...courseUrls, ...articleUrls];

    const urlEntries = allUrls
      .map((u) => {
        const parts = [`    <loc>${this.escapeXml(u.loc)}</loc>`];
        if (u.lastmod) parts.push(`    <lastmod>${u.lastmod}</lastmod>`);
        if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
        if (u.priority) parts.push(`    <priority>${u.priority}</priority>`);
        return `  <url>\n${parts.join('\n')}\n  </url>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
  }

  buildRobotsTxt(): string {
    const appUrl = this.config.app.appUrl;
    return [
      'User-agent: *',
      'Allow: /',
      'Disallow: /profile',
      'Disallow: /auth',
      'Disallow: /api/',
      '',
      `Sitemap: ${appUrl}/sitemap.xml`,
    ].join('\n');
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
