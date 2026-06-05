import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { EpisodeStatus } from '@modules/course/enum/episode-status.enum';
import { CourseEpisodeEntity } from '@modules/course/entity/course-episode.entity';

@Injectable()
export class CourseEpisodeRepository extends BaseRepository<CourseEpisodeEntity> {
  constructor(
    @InjectRepository(CourseEpisodeEntity)
    repository: Repository<CourseEpisodeEntity>,
  ) {
    super(repository);
  }

  findPublishedByCourseId(courseId: number): Promise<CourseEpisodeEntity[]> {
    return this.createQueryBuilder('ep')
      .leftJoin('ep.chapter', 'ch')
      .where('ep.courseId = :courseId', { courseId })
      .andWhere('ep.status = :status', { status: EpisodeStatus.PUBLISHED })
      .andWhere('ep.deletedAt IS NULL')
      .orderBy('COALESCE(ch.sortOrder, 0)', 'ASC')
      .addOrderBy('ep.sortOrder', 'ASC')
      .getMany();
  }

  findPublishedBySlugAndCourseId(
    courseId: number,
    slug: string,
  ): Promise<CourseEpisodeEntity | null> {
    return this.findOne({
      where: { courseId, slug, status: EpisodeStatus.PUBLISHED },
    });
  }

  countPublishedByCourseId(courseId: number): Promise<number> {
    return this.count({ courseId, status: EpisodeStatus.PUBLISHED });
  }

  sumDurationByCourseId(courseId: number): Promise<number> {
    return this.createQueryBuilder('episode')
      .select('COALESCE(SUM(episode.video_duration), 0)', 'total')
      .where('episode.courseId = :courseId', { courseId })
      .andWhere('episode.status = :status', { status: EpisodeStatus.PUBLISHED })
      .andWhere('episode.deletedAt IS NULL')
      .getRawOne<{ total: string }>()
      .then((r) => parseInt(r?.total ?? '0', 10));
  }
}
