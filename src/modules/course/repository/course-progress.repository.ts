import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { CourseProgressEntity } from '@modules/course/entity/course-progress.entity';

@Injectable()
export class CourseProgressRepository extends BaseRepository<CourseProgressEntity> {
  constructor(
    @InjectRepository(CourseProgressEntity)
    repository: Repository<CourseProgressEntity>,
  ) {
    super(repository);
  }

  findByUserAndEpisode(userId: number, episodeId: number): Promise<CourseProgressEntity | null> {
    return this.findOne({ where: { userId, episodeId } });
  }

  findByUserAndCourse(userId: number, courseId: number): Promise<CourseProgressEntity[]> {
    return this.findMany({ where: { userId, courseId } });
  }

  countCompletedByUserAndCourse(userId: number, courseId: number): Promise<number> {
    return this.count({ userId, courseId, isCompleted: true });
  }

  findLastWatchedByCourse(userId: number, courseId: number): Promise<CourseProgressEntity | null> {
    return this.findOne({
      where: { userId, courseId },
      order: { lastWatchedAt: 'DESC' },
      relations: { episode: true },
    });
  }
}
