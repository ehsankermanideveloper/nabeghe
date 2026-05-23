import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Public } from '@modules/auth/decorator/public.decorator';
import { CurrentUser } from '@modules/auth/decorator/current-user.decorator';
import { SessionAuthGuard } from '@modules/auth/guard/session-auth.guard';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import { CourseQueryDto } from '@modules/course/dto/course-query.dto';
import { SubmitCommentDto } from '@modules/course/dto/submit-comment.dto';
import { UpdateProgressDto } from '@modules/course/dto/update-progress.dto';
import { CourseCommentService } from '@modules/course/service/course-comment.service';
import { CourseEnrollmentService } from '@modules/course/service/course-enrollment.service';
import { CourseEpisodeService } from '@modules/course/service/course-episode.service';
import { CourseProgressService } from '@modules/course/service/course-progress.service';
import { CourseService } from '@modules/course/service/course.service';
import { CourseWishlistService } from '@modules/course/service/course-wishlist.service';

@Controller('api/courses')
export class CourseApiController {
  constructor(
    private readonly courseService: CourseService,
    private readonly episodeService: CourseEpisodeService,
    private readonly enrollmentService: CourseEnrollmentService,
    private readonly progressService: CourseProgressService,
    private readonly commentService: CourseCommentService,
    private readonly wishlistService: CourseWishlistService,
  ) {}

  @Get()
  @Public()
  async list(@Query() query: CourseQueryDto) {
    const result = await this.courseService.findPaged(query);
    return { data: result.data, meta: result };
  }

  /** Enrollment + wishlist status for the current user */
  @Get(':slug/status')
  @UseGuards(SessionAuthGuard)
  async status(
    @Param('slug') slug: string,
    @CurrentUser() user: SessionUserPayload,
  ) {
    const course = await this.courseService.findPublishedBySlugOrFail(slug);
    const [isEnrolled, isWishlisted] = await Promise.all([
      this.enrollmentService.isEnrolled(user.id, course.id),
      this.wishlistService.isWishlisted(user.id, course.id),
    ]);
    return { isEnrolled, isWishlisted };
  }

  @Post(':slug/enroll')
  @UseGuards(SessionAuthGuard)
  async enroll(
    @Param('slug') slug: string,
    @CurrentUser() user: SessionUserPayload,
  ) {
    const course = await this.courseService.findPublishedBySlugOrFail(slug);
    const enrollment = await this.enrollmentService.enroll(user.id, course.id);
    return { message: 'با موفقیت ثبت‌نام شدید', enrollmentId: enrollment.id };
  }

  @Delete(':slug/enroll')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard)
  async unenroll(
    @Param('slug') slug: string,
    @CurrentUser() user: SessionUserPayload,
  ) {
    const course = await this.courseService.findPublishedBySlugOrFail(slug);
    await this.enrollmentService.unenroll(user.id, course.id);
    return { message: 'از دوره خارج شدید' };
  }

  @Post(':slug/wishlist')
  @UseGuards(SessionAuthGuard)
  async toggleWishlist(
    @Param('slug') slug: string,
    @CurrentUser() user: SessionUserPayload,
  ) {
    const course = await this.courseService.findPublishedBySlugOrFail(slug);
    const result = await this.wishlistService.toggle(user.id, course.id);
    return {
      message: result.wishlisted ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد',
      ...result,
    };
  }

  @Get(':slug/comments')
  @Public()
  async comments(@Param('slug') slug: string) {
    const course = await this.courseService.findPublishedBySlugOrFail(slug);
    const comments = await this.commentService.getApprovedComments(course.id);
    const avgRating = await this.commentService.getAverageRating(course.id);
    return { data: comments, avgRating };
  }

  @Post(':slug/comments')
  @UseGuards(SessionAuthGuard)
  async submitComment(
    @Param('slug') slug: string,
    @CurrentUser() user: SessionUserPayload,
    @Body() dto: SubmitCommentDto,
  ) {
    const comment = await this.commentService.submit(user.id, slug, dto);
    return {
      message: 'نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده خواهد شد',
      commentId: comment.id,
    };
  }

  @Post(':slug/episodes/:episodeSlug/progress')
  @UseGuards(SessionAuthGuard)
  async updateProgress(
    @Param('slug') slug: string,
    @Param('episodeSlug') episodeSlug: string,
    @CurrentUser() user: SessionUserPayload,
    @Body() dto: UpdateProgressDto,
  ) {
    const course = await this.courseService.findPublishedBySlugOrFail(slug);
    const enrolled = await this.enrollmentService.isEnrolled(user.id, course.id);
    if (!enrolled) {
      return { message: 'ابتدا در دوره ثبت‌نام کنید' };
    }

    const episode = await this.episodeService.findPublishedBySlugOrFail(course.id, episodeSlug);
    const progress = await this.progressService.upsertProgress(
      user.id,
      course.id,
      episode.id,
      dto,
    );

    return { watchedSeconds: progress.watchedSeconds, isCompleted: progress.isCompleted };
  }

  @Get(':slug/episodes/:episodeSlug/progress')
  @UseGuards(SessionAuthGuard)
  async getProgress(
    @Param('slug') slug: string,
    @Param('episodeSlug') episodeSlug: string,
    @CurrentUser() user: SessionUserPayload,
  ) {
    const course = await this.courseService.findPublishedBySlugOrFail(slug);
    const episode = await this.episodeService.findPublishedBySlugOrFail(course.id, episodeSlug);
    const progress = await this.progressService.getEpisodeProgress(user.id, episode.id);
    const percent = await this.progressService.getCompletionPercentage(
      user.id,
      course.id,
      course.totalEpisodes,
    );
    return { progress, completionPercent: percent };
  }
}
