import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { EpisodeStatus } from '@modules/course/enum/episode-status.enum';
import { CourseChapterEntity } from '@modules/course/entity/course-chapter.entity';

@Injectable()
export class CourseChapterRepository extends BaseRepository<CourseChapterEntity> {
  constructor(
    @InjectRepository(CourseChapterEntity)
    repository: Repository<CourseChapterEntity>,
  ) {
    super(repository);
  }

  findByCourseIdWithEpisodes(courseId: number): Promise<CourseChapterEntity[]> {
    return this.createQueryBuilder('chapter')
      .leftJoinAndSelect(
        'chapter.episodes',
        'episode',
        'episode.status = :status AND episode.deletedAt IS NULL',
        { status: EpisodeStatus.PUBLISHED },
      )
      .where('chapter.courseId = :courseId', { courseId })
      .andWhere('chapter.isActive = true')
      .andWhere('chapter.deletedAt IS NULL')
      .orderBy('chapter.sortOrder', 'ASC')
      .addOrderBy('episode.sortOrder', 'ASC')
      .getMany();
  }
}
