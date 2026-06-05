import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from '@modules/auth/decorator/public.decorator';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import { CourseQueryDto } from '@modules/course/dto/course-query.dto';
import { EpisodeStatus } from '@modules/course/enum/episode-status.enum';
import { EpisodeAccessGuard } from '@modules/course/guard/episode-access.guard';
import { CourseCommentService } from '@modules/course/service/course-comment.service';
import { CourseEnrollmentService } from '@modules/course/service/course-enrollment.service';
import { CourseEpisodeService } from '@modules/course/service/course-episode.service';
import { CourseProgressService } from '@modules/course/service/course-progress.service';
import { CourseService } from '@modules/course/service/course.service';
import { CourseWishlistService } from '@modules/course/service/course-wishlist.service';
import { TypedConfigService } from '@common/config/typed-config.service';

type ReqWithUser = Request & { user?: SessionUserPayload };

@Public()
@Controller('courses')
export class CourseViewController {
  constructor(
    private readonly courseService: CourseService,
    private readonly episodeService: CourseEpisodeService,
    private readonly enrollmentService: CourseEnrollmentService,
    private readonly progressService: CourseProgressService,
    private readonly commentService: CourseCommentService,
    private readonly wishlistService: CourseWishlistService,
    private readonly config: TypedConfigService,
  ) {}

  @Get()
  @Render('view/pages/course/index')
  async index(@Query() query: CourseQueryDto, @Req() req: ReqWithUser): Promise<object> {
    const { courses, pagination, categories, currentCategory } =
      await this.courseService.findIndexData(query);

    const userId = req.user?.id;
    const wishlistedIds = userId
      ? await this.wishlistService.getWishlistedCourseIds(userId)
      : [];

    const appUrl = this.config.app.appUrl;
    const catSlug = query.category ? `?category=${query.category}` : '';

    return {
      pageTitle: currentCategory
        ? `${currentCategory.title} — دوره‌های آموزشی — لیان امیری`
        : 'دوره‌های آموزشی — لیان امیری',
      seoDescription: currentCategory
        ? `دوره‌های آموزشی ${currentCategory.title} — آکادمی لیان امیری`
        : 'دوره‌های آموزشی رایگان و تخصصی — آکادمی لیان امیری',
      seoCanonical: `${appUrl}/courses${catSlug}`,
      courses,
      pagination,
      query,
      categories,
      currentCategory,
      wishlistedIds,
    };
  }

  @Get(':slug')
  @Render('view/pages/course/detail')
  async detail(@Param('slug') slug: string, @Req() req: ReqWithUser): Promise<object> {
    const course = await this.courseService.findPublishedBySlugOrFail(slug);
    const chapters = await this.episodeService.getChaptersWithEpisodes(course.id);
    const comments = await this.commentService.getApprovedComments(course.id);
    const avgRating = await this.commentService.getAverageRating(course.id);
    const ratingCount = await this.commentService.getRatingCount(course.id);

    const userId = req.user?.id;
    const isEnrolled = userId
      ? await this.enrollmentService.isEnrolled(userId, course.id)
      : false;
    const isWishlisted = userId
      ? await this.wishlistService.isWishlisted(userId, course.id)
      : false;

    const allEpisodes = chapters.flatMap((ch) => ch.episodes);
    const freeEpisodeCount = allEpisodes.filter((e) => e.isFree).length;

    const appUrl = this.config.app.appUrl;
    const courseUrl = `${appUrl}/courses/${course.slug}`;
    const thumbnail = course.thumbnail
      ? (course.thumbnail.startsWith('http') ? course.thumbnail : `${appUrl}${course.thumbnail}`)
      : null;

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.shortDescription ?? course.title,
      url: courseUrl,
      image: thumbnail,
      provider: {
        '@type': 'Organization',
        name: 'آکادمی لیان امیری',
        '@id': `${appUrl}/#organization`,
      },
      offers: {
        '@type': 'Offer',
        price: course.price ?? 0,
        priceCurrency: 'IRR',
        availability: 'https://schema.org/InStock',
      },
    });

    return {
      pageTitle: `${course.title} — لیان امیری`,
      seoDescription: course.shortDescription ?? `دوره آموزشی ${course.title} — آکادمی لیان امیری`,
      seoCanonical: courseUrl,
      ogType: 'website',
      ogImage: thumbnail,
      jsonLd,
      course,
      chapters,
      comments,
      avgRating,
      ratingCount,
      isEnrolled,
      isWishlisted,
      freeEpisodeCount,
      mustEnroll: req.query['must_enroll'] === '1',
    };
  }

  @Get(':slug/episodes')
  @UseGuards(EpisodeAccessGuard)
  async episodesIndex(
    @Param('slug') slug: string,
    @Req() req: ReqWithUser,
    @Res() res: Response,
  ): Promise<void> {
    const course = await this.courseService.findPublishedBySlugOrFail(slug);
    const episodes = await this.episodeService.getPublishedEpisodes(course.id);

    if (episodes.length === 0) throw new NotFoundException('این دوره هنوز قسمتی ندارد');

    const userId = req.user?.id;
    let targetEpisode = episodes[0];

    if (userId) {
      const lastWatched = await this.progressService.getLastWatched(userId, course.id);
      if (lastWatched?.episode) {
        const found = episodes.find((e) => e.id === lastWatched.episodeId);
        if (found) targetEpisode = found;
      }
    }

    res.redirect(`/courses/${slug}/episodes/${targetEpisode.slug}`);
  }

  @Get(':slug/episodes/:episodeSlug')
  @UseGuards(EpisodeAccessGuard)
  @Render('view/pages/course/episodes')
  async episode(
    @Param('slug') slug: string,
    @Param('episodeSlug') episodeSlug: string,
    @Req() req: ReqWithUser,
  ): Promise<object> {
    const course = await this.courseService.findPublishedBySlugOrFail(slug);
    const chapters = await this.episodeService.getChaptersWithEpisodes(course.id);
    const episode = await this.episodeService.findPublishedBySlugOrFail(course.id, episodeSlug);

    const { prev, next } = await this.episodeService.getAdjacentEpisodes(course.id, episode.id);

    const userId = req.user?.id;
    const isEnrolled = userId
      ? await this.enrollmentService.isEnrolled(userId, course.id)
      : false;

    let progress: import('@modules/course/entity/course-progress.entity').CourseProgressEntity | null = null;
    let completedIds = new Set<number>();
    let completionPercent = 0;

    if (userId && isEnrolled) {
      progress = await this.progressService.getEpisodeProgress(userId, episode.id);
      completedIds = await this.progressService.getCompletedEpisodeIds(userId, course.id);
      completionPercent = await this.progressService.getCompletionPercentage(
        userId,
        course.id,
        course.totalEpisodes,
      );
    }

    const allEpisodes = chapters.flatMap((ch) => ch.episodes);
    const episodeIndex = allEpisodes.findIndex((e) => e.id === episode.id);

    return {
      usePlyr: true,
      pageTitle: `${episode.title} — ${course.title} — لیان امیری`,
      seoRobots: 'noindex, follow',
      course,
      chapters,
      episode,
      episodeIndex,
      prev,
      next,
      isEnrolled,
      progress,
      completedIds: [...completedIds],
      completionPercent,
    };
  }
}
