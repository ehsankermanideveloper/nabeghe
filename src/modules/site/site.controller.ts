import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class SiteController {
  @Get()
  @Render('view/pages/site/home')
  home(): { pageTitle: string } {
    return {
      pageTitle: 'قالب آموزشی نابغه - صفحه اصلی',
    };
  }
}
