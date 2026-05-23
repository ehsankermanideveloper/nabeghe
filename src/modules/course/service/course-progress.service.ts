import { Injectable } from '@nestjs/common';
import { UpdateProgressDto } from '@modules/course/dto/update-progress.dto';
import { CourseProgressEntity } from '@modules/course/entity/course-progress.entity';
import { CourseProgressRepository } from '@modules/course/repository/course-progress.repository';

@Injectable()
export class CourseProgressService {
  constructor(private readonly progressRepository: CourseProgressRepository) {}

  async upsertProgress(
    userId: number,
    courseId: number,
    episodeId: number,
    dto: UpdateProgressDto,
  ): Promise<CourseProgressEntity> {
    const existing = await this.progressRepository.findByUserAndEpisode(userId, episodeId);

    if (existing) {
      existing.watchedSeconds = Math.max(existing.watchedSeconds, dto.watchedSeconds);
      existing.isCompleted = existing.isCompleted || dto.isCompleted;
      existing.lastWatchedAt = new Date();
      return (await this.progressRepository.save(existing)) as CourseProgressEntity;
    }

    const record = this.progressRepository.build({
      userId,
      courseId,
      episodeId,
      watchedSeconds: dto.watchedSeconds,
      isCompleted: dto.isCompleted,
      lastWatchedAt: new Date(),
    });

    return (await this.progressRepository.save(record)) as CourseProgressEntity;
  }

  getEpisodeProgress(userId: number, episodeId: number): Promise<CourseProgressEntity | null> {
    return this.progressRepository.findByUserAndEpisode(userId, episodeId);
  }

  getCourseProgress(userId: number, courseId: number): Promise<CourseProgressEntity[]> {
    return this.progressRepository.findByUserAndCourse(userId, courseId);
  }

  async getCompletionPercentage(
    userId: number,
    courseId: number,
    totalEpisodes: number,
  ): Promise<number> {
    if (totalEpisodes === 0) return 0;
    const completed = await this.progressRepository.countCompletedByUserAndCourse(userId, courseId);
    return Math.round((completed / totalEpisodes) * 100);
  }

  getLastWatched(userId: number, courseId: number): Promise<CourseProgressEntity | null> {
    return this.progressRepository.findLastWatchedByCourse(userId, courseId);
  }

  /** Map of episodeId → isCompleted for quick lookup in views */
  async getCompletedEpisodeIds(userId: number, courseId: number): Promise<Set<number>> {
    const records = await this.progressRepository.findByUserAndCourse(userId, courseId);
    return new Set(records.filter((r) => r.isCompleted).map((r) => r.episodeId));
  }
}
