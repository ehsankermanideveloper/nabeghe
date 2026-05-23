import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository, type PagedResult } from '@common/repository/base.repository';
import { CourseStatus } from '@modules/course/enum/course-status.enum';
import { CourseSort } from '@modules/course/enum/course-sort.enum';
import { CourseEntity } from '@modules/course/entity/course.entity';

export interface CourseFilter {
  q?: string;
  categoryId?: number;
  level?: string;
  sort?: CourseSort;
  page: number;
  limit: number;
}

@Injectable()
export class CourseRepository extends BaseRepository<CourseEntity> {
  constructor(
    @InjectRepository(CourseEntity)
    repository: Repository<CourseEntity>,
  ) {
    super(repository);
  }

  findPublishedBySlug(slug: string): Promise<CourseEntity | null> {
    return this.findOne({
      where: { slug, status: CourseStatus.PUBLISHED },
      relations: { instructor: true, category: true, tags: true },
    });
  }

  async findPublishedPaged(filter: CourseFilter): Promise<PagedResult<CourseEntity>> {
    const qb = this.createQueryBuilder('course')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoinAndSelect('course.category', 'category')
      .where('course.status = :status', { status: CourseStatus.PUBLISHED })
      .andWhere('course.deletedAt IS NULL');

    if (filter.q) {
      qb.andWhere(
        '(course.title ILIKE :q OR course.short_description ILIKE :q)',
        { q: `%${filter.q}%` },
      );
    }

    if (filter.categoryId) {
      qb.andWhere('course.categoryId = :categoryId', { categoryId: filter.categoryId });
    }

    if (filter.level) {
      qb.andWhere('course.level = :level', { level: filter.level });
    }

    if (filter.sort === CourseSort.FREE) {
      qb.andWhere('course.price = 0');
    } else if (filter.sort === CourseSort.PAID) {
      qb.andWhere('course.price > 0');
    }

    switch (filter.sort) {
      case CourseSort.POPULAR:
        qb.orderBy('course.studentCount', 'DESC');
        break;
      case CourseSort.PRICE_ASC:
        qb.orderBy('course.price', 'ASC');
        break;
      case CourseSort.PRICE_DESC:
        qb.orderBy('course.price', 'DESC');
        break;
      case CourseSort.NEWEST:
      default:
        qb.orderBy('course.publishedAt', 'DESC');
        break;
    }

    const safeLimit = Math.max(1, Math.min(filter.limit, 48));
    const safePage = Math.max(1, filter.page);
    const [data, total] = await qb
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit)
      .getManyAndCount();

    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    };
  }

  findPublishedByCategoryId(categoryId: number, limit = 12): Promise<CourseEntity[]> {
    return this.findMany({
      where: { categoryId, status: CourseStatus.PUBLISHED },
      order: { studentCount: 'DESC' },
      take: limit,
    });
  }

  findLatestPublished(limit = 8): Promise<CourseEntity[]> {
    return this.findMany({
      where: { status: CourseStatus.PUBLISHED },
      order: { publishedAt: 'DESC' },
      take: limit,
    });
  }

  findPopularPublished(limit = 8): Promise<CourseEntity[]> {
    return this.findMany({
      where: { status: CourseStatus.PUBLISHED },
      order: { studentCount: 'DESC' },
      take: limit,
    });
  }
}
