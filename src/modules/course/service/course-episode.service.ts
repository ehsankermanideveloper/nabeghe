import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseChapterEntity } from '@modules/course/entity/course-chapter.entity';
import { CourseEpisodeEntity } from '@modules/course/entity/course-episode.entity';
import { CourseChapterRepository } from '@modules/course/repository/course-chapter.repository';
import { CourseEpisodeRepository } from '@modules/course/repository/course-episode.repository';

@Injectable()
export class CourseEpisodeService {
  constructor(
    private readonly episodeRepository: CourseEpisodeRepository,
    private readonly chapterRepository: CourseChapterRepository,
  ) {}

  getChaptersWithEpisodes(courseId: number): Promise<CourseChapterEntity[]> {
    return this.chapterRepository.findByCourseIdWithEpisodes(courseId);
  }

  getPublishedEpisodes(courseId: number): Promise<CourseEpisodeEntity[]> {
    return this.episodeRepository.findPublishedByCourseId(courseId);
  }

  async findPublishedBySlugOrFail(courseId: number, slug: string): Promise<CourseEpisodeEntity> {
    const episode = await this.episodeRepository.findPublishedBySlugAndCourseId(courseId, slug);
    if (!episode) throw new NotFoundException('قسمت یافت نشد');
    return episode;
  }

  async getFirstEpisode(courseId: number): Promise<CourseEpisodeEntity | null> {
    const episodes = await this.episodeRepository.findPublishedByCourseId(courseId);
    return episodes[0] ?? null;
  }

  async getAdjacentEpisodes(
    courseId: number,
    currentEpisodeId: number,
  ): Promise<{ prev: CourseEpisodeEntity | null; next: CourseEpisodeEntity | null }> {
    const episodes = await this.episodeRepository.findPublishedByCourseId(courseId);
    const index = episodes.findIndex((e) => e.id === currentEpisodeId);
    return {
      prev: index > 0 ? episodes[index - 1] : null,
      next: index < episodes.length - 1 ? episodes[index + 1] : null,
    };
  }
}
