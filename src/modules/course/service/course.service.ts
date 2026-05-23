import { Injectable, NotFoundException } from '@nestjs/common';
import type { PagedResult } from '@common/repository/base.repository';
import { CategoryRepository } from '@modules/category/repository/category.repository';
import { CourseQueryDto } from '@modules/course/dto/course-query.dto';
import { CourseEntity } from '@modules/course/entity/course.entity';
import { CourseSort } from '@modules/course/enum/course-sort.enum';
import { CourseRepository } from '@modules/course/repository/course.repository';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findPublishedBySlugOrFail(slug: string): Promise<CourseEntity> {
    const course = await this.courseRepository.findPublishedBySlug(slug);
    if (!course) throw new NotFoundException('دوره یافت نشد');
    return course;
  }

  async findPaged(dto: CourseQueryDto): Promise<PagedResult<CourseEntity>> {
    let categoryId: number | undefined;

    if (dto.category) {
      const cat = await this.categoryRepository.findOne({ where: { slug: dto.category } });
      if (cat) categoryId = cat.id;
    }

    return this.courseRepository.findPublishedPaged({
      q: dto.q,
      categoryId,
      level: dto.level,
      sort: dto.sort ?? CourseSort.NEWEST,
      page: dto.page ?? 1,
      limit: dto.limit ?? 12,
    });
  }

  findLatest(limit = 8): Promise<CourseEntity[]> {
    return this.courseRepository.findLatestPublished(limit);
  }

  findPopular(limit = 8): Promise<CourseEntity[]> {
    return this.courseRepository.findPopularPublished(limit);
  }

  async updateStudentCount(courseId: number): Promise<void> {
    const count = await this.courseRepository
      .createQueryBuilder('c')
      .select('COUNT(e.id)', 'cnt')
      .leftJoin('course_enrollment', 'e', 'e.course_id = c.id')
      .where('c.id = :courseId', { courseId })
      .getRawOne<{ cnt: string }>();

    await this.courseRepository.updateOneById(courseId, {
      studentCount: parseInt(count?.cnt ?? '0', 10),
    });
  }

  async updateEpisodeCounts(
    courseId: number,
    totalEpisodes: number,
    totalDuration: number,
  ): Promise<void> {
    await this.courseRepository.updateOneById(courseId, {
      totalEpisodes,
      totalDuration,
    });
  }
}
