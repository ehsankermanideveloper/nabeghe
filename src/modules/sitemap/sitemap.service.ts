import { Injectable } from '@nestjs/common';
import { TypedConfigService } from '@common/config/typed-config.service';
import { CourseService } from '@modules/course/service/course.service';
import { ArticleService } from '@modules/article/service/article.service';

@Injectable()
export class SitemapService {
  constructor(
    private readonly config: TypedConfigService,
    private readonly courseService: CourseService,
    private readonly articleService: ArticleService,
  ) {}

  buildSitemapIndex(): string {
    const appUrl = this.config.app.appUrl;
    const today = new Date().toISOString().split('T')[0];
    const sitemaps = [
      { loc: `${appUrl}/sitemap-pages.xml`, lastmod: today },
      { loc: `${appUrl}/sitemap-courses.xml` },
      { loc: `${appUrl}/sitemap-blog.xml` },
    ];
    const entries = sitemaps
      .map((s) => {
        const parts = [`  <loc>${this.escapeXml(s.loc)}</loc>`];
        if (s.lastmod) parts.push(`  <lastmod>${s.lastmod}</lastmod>`);
        return `<sitemap>\n${parts.join('\n')}\n</sitemap>`;
      })
      .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;
  }

  buildPagesSitemap(): string {
    const appUrl = this.config.app.appUrl;
    const urls = [
      { loc: `${appUrl}/` },
      { loc: `${appUrl}/courses` },
      { loc: `${appUrl}/blog` },
      { loc: `${appUrl}/about-us` },
      { loc: `${appUrl}/terms` },
    ];
    return this.buildUrlset(urls);
  }

  async buildCoursesSitemap(): Promise<string> {
    const appUrl = this.config.app.appUrl;
    const slugs = await this.courseService.findAllPublishedSlugs();
    const urls = slugs.map((c) => ({
      loc: `${appUrl}/courses/${c.slug}`,
      lastmod: c.updatedAt ? new Date(c.updatedAt).toISOString().split('T')[0] : undefined,
    }));
    return this.buildUrlset(urls);
  }

  async buildBlogSitemap(): Promise<string> {
    const appUrl = this.config.app.appUrl;
    const slugs = await this.articleService.findAllPublishedSlugs();
    const urls = slugs.map((a) => ({
      loc: `${appUrl}/blog/${a.slug}`,
      lastmod: a.updatedAt ? new Date(a.updatedAt).toISOString().split('T')[0] : undefined,
    }));
    return this.buildUrlset(urls);
  }

  buildRobotsTxt(): string {
    const appUrl = this.config.app.appUrl;
    return [
      'User-agent: *',
      'Disallow: /',
      '',
      `Sitemap: ${appUrl}/sitemap.xml`,
    ].join('\n');
  }

  private buildUrlset(urls: Array<{ loc: string; lastmod?: string }>): string {
    const entries = urls
      .map((u) => {
        const parts = [`    <loc>${this.escapeXml(u.loc)}</loc>`];
        if (u.lastmod) parts.push(`    <lastmod>${u.lastmod}</lastmod>`);
        return `  <url>\n${parts.join('\n')}\n  </url>`;
      })
      .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
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
