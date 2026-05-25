import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { CourseWishlistEntity } from '@modules/course/entity/course-wishlist.entity';

@Injectable()
export class CourseWishlistRepository extends BaseRepository<CourseWishlistEntity> {
  constructor(
    @InjectRepository(CourseWishlistEntity)
    repository: Repository<CourseWishlistEntity>,
  ) {
    super(repository);
  }

  findByUserAndCourse(userId: number, courseId: number): Promise<CourseWishlistEntity | null> {
    return this.findOne({ where: { userId, courseId } });
  }

  existsByUserAndCourse(userId: number, courseId: number): Promise<boolean> {
    return this.repository.exists({ where: { userId, courseId } });
  }

  findByUserId(userId: number): Promise<CourseWishlistEntity[]> {
    return this.findMany({
      where: { userId },
      relations: { course: { instructor: true, category: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async getCourseIdsByUserId(userId: number): Promise<number[]> {
    const rows = await this.findMany({ where: { userId }, select: { courseId: true } });
    return rows.map((r) => r.courseId);
  }
}
