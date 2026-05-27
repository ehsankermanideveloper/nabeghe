import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '@modules/auth/decorator/current-user.decorator';
import { SessionAuthGuard } from '@modules/auth/guard/session-auth.guard';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import { AuthService } from '@modules/auth/service/auth.service';
import { CourseCommentService } from '@modules/course/service/course-comment.service';
import { CourseEnrollmentService } from '@modules/course/service/course-enrollment.service';
import { CourseProgressService } from '@modules/course/service/course-progress.service';
import { CourseWishlistService } from '@modules/course/service/course-wishlist.service';

@Controller('profile')
@UseGuards(SessionAuthGuard)
export class ProfileController {
  constructor(
    private readonly authService: AuthService,
    private readonly enrollmentService: CourseEnrollmentService,
    private readonly progressService: CourseProgressService,
    private readonly wishlistService: CourseWishlistService,
    private readonly commentService: CourseCommentService,
  ) {}

  @Get()
  @Render('view/pages/profile/index')
  async index(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
  ): Promise<Record<string, unknown>> {
    const enrollments = await this.enrollmentService.getMyEnrollments(user.id);
    const commnetCount = await this.commentService.getMyCommentsCount(user.id)
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (e) => {
        const percentage = await this.progressService.getCompletionPercentage(
          user.id,
          e.courseId,
          e.course.totalEpisodes,
        );
        return { enrollment: e, percentage };
      }),
    );

    const inLearning = enrollmentsWithProgress.filter(
      (r) => r.percentage > 0 && r.percentage < 100,
    );

    return {
      pageTitle: 'داشبورد — لیان امیری',
      seoRobots: 'noindex, nofollow',
      user,
      csrfToken: this.authService.ensureCsrfToken(req),
      inLearning,
      totalEnrolled: enrollments.length,
      totalCompleted: enrollmentsWithProgress.filter((r) => r.percentage >= 100).length,
      commnetCount
    };
  }

  @Get('courses')
  @Render('view/pages/profile/courses')
  async courses(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
  ): Promise<Record<string, unknown>> {
    const enrollments = await this.enrollmentService.getMyEnrollments(user.id);

    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (e) => {
        const percentage = await this.progressService.getCompletionPercentage(
          user.id,
          e.courseId,
          e.course.totalEpisodes,
        );
        return { enrollment: e, percentage };
      }),
    );

    const inProgress = enrollmentsWithProgress.filter(
      (r) => r.percentage > 0 && r.percentage < 100,
    );
    const notStarted = enrollmentsWithProgress.filter((r) => r.percentage === 0);
    const completed = enrollmentsWithProgress.filter((r) => r.percentage >= 100);

    return {
      pageTitle: 'دوره‌های من — لیان امیری',
      seoRobots: 'noindex, nofollow',
      user,
      csrfToken: this.authService.ensureCsrfToken(req),
      inProgress,
      notStarted,
      completed,
    };
  }

  @Get('wishlist')
  @Render('view/pages/profile/wishlist')
  async wishlist(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
  ): Promise<Record<string, unknown>> {
    const wishlist = await this.wishlistService.getMyWishlist(user.id);

    return {
      pageTitle: 'علاقه‌مندی‌ها — لیان امیری',
      seoRobots: 'noindex, nofollow',
      user,
      csrfToken: this.authService.ensureCsrfToken(req),
      wishlist,
    };
  }

  @Get('comments')
  @Render('view/pages/profile/comments')
  async comments(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
  ): Promise<Record<string, unknown>> {
    const comments = await this.commentService.getMyComments(user.id);

    return {
      pageTitle: 'دیدگاه‌های من — لیان امیری',
      seoRobots: 'noindex, nofollow',
      user,
      csrfToken: this.authService.ensureCsrfToken(req),
      comments,
    };
  }

  @Get('financial')
  @Render('view/pages/profile/financial')
  async financial(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
  ): Promise<Record<string, unknown>> {
    return {
      pageTitle: 'مالی و اشتراک — لیان امیری',
      seoRobots: 'noindex, nofollow',
      user,
      csrfToken: this.authService.ensureCsrfToken(req),
      transactions: [],
    };
  }

  @Get('notifications')
  @Render('view/pages/profile/notifications')
  async notifications(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
  ): Promise<Record<string, unknown>> {
    return {
      pageTitle: 'اعلانات — لیان امیری',
      seoRobots: 'noindex, nofollow',
      user,
      csrfToken: this.authService.ensureCsrfToken(req),
      notifications: [],
    };
  }

  @Get('edit')
  @Render('view/pages/profile/edit')
  async edit(
    @Req() req: Request,
    @CurrentUser() user: SessionUserPayload,
  ): Promise<Record<string, unknown>> {
    return {
      pageTitle: 'ویرایش پروفایل — لیان امیری',
      seoRobots: 'noindex, nofollow',
      user,
      csrfToken: this.authService.ensureCsrfToken(req),
    };
  }
}
