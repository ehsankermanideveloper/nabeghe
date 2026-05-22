import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class SiteController {
  @Get()
    @Render('view/pages/site/home')
    home(): { pageTitle: string } {
      return {
        pageTitle: 'آموزشی نابغه - صفحه اصلی',
      };
    }

    @Get('terms')
    @Render('view/pages/site/terms')
    terms(): { pageTitle: string } {
      return {
        pageTitle: 'آموزشی نابغه - قوانین و مقررات',
      };
    }

    @Get('about-us')
    @Render('view/pages/site/about-us')
    aboutUs(): { pageTitle: string } {
      return {
        pageTitle: 'آموزشی نابغه - درباره ما',
      };
    }
}
