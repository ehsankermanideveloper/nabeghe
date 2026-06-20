import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AdminGuard } from '@modules/admin/guard/admin.guard';
import { AdminService } from '@modules/admin/service/admin.service';
import { CourseCertificateService } from '@modules/course/service/course-certificate.service';
import { CourseService } from '@modules/course/service/course.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminViewController {
  constructor(
    private readonly adminService: AdminService,
    private readonly certificateService: CourseCertificateService,
    private readonly courseService: CourseService,
  ) {}

  @Get()
  async dashboard(@Req() _req: Request, @Res() res: Response): Promise<void> {
    const stats = await this.adminService.getDashboardStats();
    res.render('view/pages/admin/dashboard', {
      layout: 'view/pages/admin/_layout',
      pageTitle: 'داشبورد مدیریت',
      ...stats,
    });
  }

  @Get('users')
  async users(
    @Req() _req: Request,
    @Res() res: Response,
    @Query('page') page = '1',
    @Query('search') search?: string,
  ): Promise<void> {
    const limit = 20;
    const currentPage = Math.max(1, parseInt(page, 10));
    const { data, total } = await this.adminService.getUsers(currentPage, limit, search);
    const totalPages = Math.ceil(total / limit);

    res.render('view/pages/admin/users', {
      layout: 'view/pages/admin/_layout',
      pageTitle: 'مدیریت کاربران',
      users: data,
      total,
      currentPage,
      totalPages,
      search: search ?? '',
      limit,
    });
  }

  @Get('courses')
  async courses(
    @Req() _req: Request,
    @Res() res: Response,
    @Query('page') page = '1',
  ): Promise<void> {
    const limit = 20;
    const currentPage = Math.max(1, parseInt(page, 10));
    const { data, total } = await this.adminService.getCourses(currentPage, limit);
    const totalPages = Math.ceil(total / limit);

    res.render('view/pages/admin/courses/index', {
      layout: 'view/pages/admin/_layout',
      pageTitle: 'مدیریت دوره‌ها',
      courses: data,
      total,
      currentPage,
      totalPages,
      limit,
    });
  }

  @Get('courses/new')
  async newCourse(@Req() _req: Request, @Res() res: Response): Promise<void> {
    const categories = await this.adminService.getCategoriesForSelect();
    res.render('view/pages/admin/courses/form', {
      layout: 'view/pages/admin/_layout',
      pageTitle: 'ایجاد دوره جدید',
      course: null,
      categories,
      isEdit: false,
    });
  }

  @Get('courses/:id/edit')
  async editCourse(
    @Param('id') id: string,
    @Req() _req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const course = await this.adminService.getCourseById(parseInt(id, 10));
    const categories = await this.adminService.getCategoriesForSelect();
    res.render('view/pages/admin/courses/form', {
      layout: 'view/pages/admin/_layout',
      pageTitle: 'ویرایش دوره',
      course,
      categories,
      isEdit: true,
    });
  }

  @Get('articles')
  async articles(
    @Req() _req: Request,
    @Res() res: Response,
    @Query('page') page = '1',
  ): Promise<void> {
    const limit = 20;
    const currentPage = Math.max(1, parseInt(page, 10));
    const { data, total } = await this.adminService.getArticles(currentPage, limit);
    const totalPages = Math.ceil(total / limit);

    res.render('view/pages/admin/articles/index', {
      layout: 'view/pages/admin/_layout',
      pageTitle: 'مدیریت مقالات',
      articles: data,
      total,
      currentPage,
      totalPages,
      limit,
    });
  }

  @Get('articles/new')
  async newArticle(@Req() _req: Request, @Res() res: Response): Promise<void> {
    const categories = await this.adminService.getCategoriesForSelect();
    res.render('view/pages/admin/articles/form', {
      layout: 'view/pages/admin/_layout',
      pageTitle: 'ایجاد مقاله جدید',
      article: null,
      categories,
      isEdit: false,
      useCkeditor: true,
    });
  }

  @Get('articles/:id/edit')
  async editArticle(
    @Param('id') id: string,
    @Req() _req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const article = await this.adminService.getArticleById(parseInt(id, 10));
    const categories = await this.adminService.getCategoriesForSelect();
    res.render('view/pages/admin/articles/form', {
      layout: 'view/pages/admin/_layout',
      pageTitle: 'ویرایش مقاله',
      article,
      categories,
      isEdit: true,
      useCkeditor: true,
    });
  }

  @Get('categories')
  async categories(@Req() _req: Request, @Res() res: Response): Promise<void> {
    const categories = await this.adminService.getCategoriesForSelect();
    res.render('view/pages/admin/categories', {
      layout: 'view/pages/admin/_layout',
      pageTitle: 'مدیریت دسته‌بندی‌ها',
      categories,
    });
  }

  @Get('comments')
  async comments(
    @Req() _req: Request,
    @Res() res: Response,
    @Query('type') type = 'course',
    @Query('status') status = 'pending',
    @Query('page') page = '1',
  ): Promise<void> {
    const limit = 20;
    const currentPage = Math.max(1, parseInt(page, 10));
    const commentType = (type === 'article' ? 'article' : 'course') as 'course' | 'article';
    const { data, total } = await this.adminService.getComments(
      commentType,
      status,
      currentPage,
      limit,
    );
    const totalPages = Math.ceil(total / limit);

    res.render('view/pages/admin/comments', {
      layout: 'view/pages/admin/_layout',
      pageTitle: 'مدیریت دیدگاه‌ها',
      comments: data,
      total,
      currentPage,
      totalPages,
      limit,
      type: commentType,
      status,
    });
  }

  @Get('enrollments')
  async enrollments(
    @Req() _req: Request,
    @Res() res: Response,
    @Query('page') page = '1',
    @Query('search') search?: string,
  ): Promise<void> {
    const limit = 20;
    const currentPage = Math.max(1, parseInt(page, 10));
    const { data, total } = await this.adminService.getEnrollments(
      currentPage,
      limit,
      search,
    );
    const totalPages = Math.ceil(total / limit);
    const courses = await this.adminService.getCoursesSimple();

    res.render('view/pages/admin/enrollments', {
      layout: 'view/pages/admin/_layout',
      pageTitle: 'مدیریت ثبت‌نام‌ها',
      enrollments: data,
      total,
      currentPage,
      totalPages,
      limit,
      search: search ?? '',
      courses,
    });
  }

  @Get('enrollments/certificate/:userId/:courseSlug')
  async viewCertificate(
    @Param('userId') userId: string,
    @Param('courseSlug') courseSlug: string,
    @Res() res: Response,
  ): Promise<void> {
    const course = await this.courseService.findPublishedBySlugOrFail(courseSlug);
    const cert = await this.certificateService.findByUserAndCourseWithUser(
      parseInt(userId, 10),
      course.id,
    );

    if (!cert) {
      res.redirect('/admin/enrollments');
      return;
    }

    const u = (cert as any).user;
    const displayName = u?.displayName
      ? (u.displayName['fa'] ?? u.displayName['en'] ?? Object.values(u.displayName)[0] ?? '')
      : (u?.email ?? u?.phone ?? userId);

    res.render('view/pages/course/certificate', {
      layout: false,
      siteName: 'لیان امیری',
      courseTitle: course.title['fa'] ?? course.title['en'] ?? '',
      displayName,
      issuedAt: cert.issuedAt,
      code: cert.code,
      lp: '',
    });
  }
}
