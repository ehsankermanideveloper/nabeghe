import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { CourseTagEntity } from '@modules/course/entity/course-tag.entity';

@Injectable()
export class CourseTagRepository extends BaseRepository<CourseTagEntity> {
  constructor(
    @InjectRepository(CourseTagEntity)
    repository: Repository<CourseTagEntity>,
  ) {
    super(repository);
  }

  findByCourseId(courseId: number): Promise<CourseTagEntity[]> {
    return this.findMany({ where: { courseId }, order: { name: 'ASC' } });
  }
}
