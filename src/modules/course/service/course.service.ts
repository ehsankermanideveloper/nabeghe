import { Injectable, NotFoundException } from '@nestjs/common';
import type { PagedResult } from '@common/repository/base.repository';
import { CategoryService } from '@modules/category/service/category.service';
import type { CategoryEntity } from '@modules/category/entity/category.entity';
import { CourseQueryDto } from '@modules/course/dto/course-query.dto';
import { CourseEntity } from '@modules/course/entity/course.entity';
import { CourseSort } from '@modules/course/enum/course-sort.enum';
import { CourseRepository } from '@modules/course/repository/course.repository';

export interface CourseIndexData {
  courses: CourseEntity[];
  pagination: PagedResult<CourseEntity>;
  categories: CategoryEntity[];
  currentCategory: CategoryEntity | null;
}

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async findPublishedBySlugOrFail(slug: string): Promise<CourseEntity> {
    const course = await this.courseRepository.findPublishedBySlug(slug);
    if (!course) throw new NotFoundException('دوره یافت نشد');
    return course;
  }

  async findPaged(dto: CourseQueryDto): Promise<PagedResult<CourseEntity>> {
    let categoryIds: number[] | undefined;

    if (dto.category) {
      const cat = await this.categoryService.findBySlugWithChildren(dto.category);
      if (cat) {
        categoryIds = [cat.id, ...(cat.children ?? []).map((c) => c.id)];
      }
    }

    return this.courseRepository.findPublishedPaged({
      q: dto.q,
      categoryIds,
      level: dto.level,
      sort: dto.sort ?? CourseSort.NEWEST,
      page: dto.page ?? 1,
      limit: dto.limit ?? 12,
    });
  }

  async findIndexData(dto: CourseQueryDto): Promise<CourseIndexData> {
    const [pagination, categories] = await Promise.all([
      this.findPaged(dto),
      this.categoryService.findAllActive(),
    ]);

    const currentCategory = dto.category
      ? (categories.find((c) => c.slug === dto.category) ?? null)
      : null;

    return {
      courses: pagination.data,
      pagination,
      categories,
      currentCategory,
    };
  }

  findLatest(limit = 8): Promise<CourseEntity[]> {
    return this.courseRepository.findLatestPublished(limit);
  }

  searchPublished(q: string, limit = 6): Promise<CourseEntity[]> {
    return this.courseRepository.findPublishedPaged({ q, page: 1, limit, sort: CourseSort.NEWEST }).then((r) => r.data);
  }

  findPopular(limit = 8): Promise<CourseEntity[]> {
    return this.courseRepository.findPopularPublished(limit);
  }

  findAllPublishedSlugs(): Promise<Pick<CourseEntity, 'slug' | 'updatedAt'>[]> {
    return this.courseRepository.findAllPublishedSlugs();
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
