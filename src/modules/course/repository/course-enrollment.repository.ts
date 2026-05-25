import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { CourseEnrollmentEntity } from '@modules/course/entity/course-enrollment.entity';

@Injectable()
export class CourseEnrollmentRepository extends BaseRepository<CourseEnrollmentEntity> {
  constructor(
    @InjectRepository(CourseEnrollmentEntity)
    repository: Repository<CourseEnrollmentEntity>,
  ) {
    super(repository);
  }

  findByUserAndCourse(userId: number, courseId: number): Promise<CourseEnrollmentEntity | null> {
    return this.findOne({ where: { userId, courseId } });
  }

  existsByUserAndCourse(userId: number, courseId: number): Promise<boolean> {
    return this.repository.exists({ where: { userId, courseId } });
  }

  findByUserId(userId: number): Promise<CourseEnrollmentEntity[]> {
    return this.findMany({
      where: { userId },
      relations: { course: { instructor: true, category: true } },
      order: { enrolledAt: 'DESC' },
    });
  }

  countByCourseId(courseId: number): Promise<number> {
    return this.count({ courseId });
  }
}
