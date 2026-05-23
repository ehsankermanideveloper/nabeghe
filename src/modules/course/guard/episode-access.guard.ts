import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { SessionUserPayload } from '@modules/auth/interfaces/auth-session.interface';
import { CourseEnrollmentRepository } from '@modules/course/repository/course-enrollment.repository';
import { CourseEpisodeRepository } from '@modules/course/repository/course-episode.repository';
import { CourseRepository } from '@modules/course/repository/course.repository';

/**
 * Used on episode view routes.
 * - Episode is free → allow anyone.
 * - Episode is paid → require login + enrollment; otherwise redirect.
 */
@Injectable()
export class EpisodeAccessGuard implements CanActivate {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly episodeRepository: CourseEpisodeRepository,
    private readonly enrollmentRepository: CourseEnrollmentRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: SessionUserPayload }>();
    const res = context.switchToHttp().getResponse<Response>();

    const rawCourseSlug = req.params['slug'];
    const rawEpisodeSlug = req.params['episodeSlug'];
    const courseSlug = Array.isArray(rawCourseSlug) ? rawCourseSlug[0] : (rawCourseSlug ?? '');
    const episodeSlug = Array.isArray(rawEpisodeSlug) ? rawEpisodeSlug[0] : (rawEpisodeSlug ?? '');

    const course = await this.courseRepository.findPublishedBySlug(courseSlug);
    if (!course) throw new NotFoundException('دوره یافت نشد');

    let episode = episodeSlug
      ? await this.episodeRepository.findPublishedBySlugAndCourseId(course.id, episodeSlug)
      : null;

    // When no specific episode, check if course has any free episodes
    if (!episode && !episodeSlug) {
      const episodes = await this.episodeRepository.findPublishedByCourseId(course.id);
      if (episodes.length === 0) throw new NotFoundException('این دوره هنوز قسمتی ندارد');
      episode = episodes[0];
    }

    if (!episode) throw new NotFoundException('قسمت یافت نشد');

    if (episode.isFree) return true;

    const userId = req.session?.userId;
    if (!userId) {
      const returnTo = encodeURIComponent(req.originalUrl);
      res.redirect(`/auth/login?returnTo=${returnTo}`);
      return false;
    }

    const enrolled = await this.enrollmentRepository.existsByUserAndCourse(userId, course.id);
    if (!enrolled) {
      res.redirect(`/courses/${courseSlug}?must_enroll=1`);
      return false;
    }

    return true;
  }
}
