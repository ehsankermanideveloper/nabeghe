import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CategoryService } from '@modules/category/service/category.service';
import { CourseService } from '@modules/course/service/course.service';
import { ArticleService } from '@modules/article/service/article.service';
import { UserEntity } from '@modules/auth/entity/user.entity';
import { CourseEntity } from '@modules/course/entity/course.entity';
import { CourseChapterEntity } from '@modules/course/entity/course-chapter.entity';
import { CourseEpisodeEntity } from '@modules/course/entity/course-episode.entity';
import { CourseEnrollmentEntity } from '@modules/course/entity/course-enrollment.entity';
import { CourseCommentEntity } from '@modules/course/entity/course-comment.entity';
import { ArticleEntity } from '@modules/article/entity/article.entity';
import { ArticleCommentEntity } from '@modules/article/entity/article-comment.entity';
import { CategoryEntity } from '@modules/category/entity/category.entity';
import { CourseStatus } from '@modules/course/enum/course-status.enum';
import { EpisodeStatus } from '@modules/course/enum/episode-status.enum';
import { ArticleStatus } from '@modules/article/enum/article-status.enum';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w؀-ۿ-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class AdminService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly categoryService: CategoryService,
    private readonly courseService: CourseService,
    private readonly articleService: ArticleService,
  ) {}

  async getDashboardStats() {
    const userRepo = this.dataSource.getRepository(UserEntity);
    const courseRepo = this.dataSource.getRepository(CourseEntity);
    const articleRepo = this.dataSource.getRepository(ArticleEntity);
    const enrollRepo = this.dataSource.getRepository(CourseEnrollmentEntity);
    const courseCommentRepo = this.dataSource.getRepository(CourseCommentEntity);
    const articleCommentRepo = this.dataSource.getRepository(ArticleCommentEntity);

    const [
      totalUsers,
      totalCourses,
      totalArticles,
      totalEnrollments,
      pendingCourseComments,
      pendingArticleComments,
    ] = await Promise.all([
      userRepo.count(),
      courseRepo.count(),
      articleRepo.count(),
      enrollRepo.count(),
      courseCommentRepo.count({ where: { status: 'pending' as any } }),
      articleCommentRepo.count({ where: { status: 'pending' as any } }),
    ]);

    const recentEnrollmentsRaw = await enrollRepo.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: { course: true, user: true },
    });

    const recentEnrollments = recentEnrollmentsRaw.map((e) => ({
      id: e.id,
      userId: e.userId,
      courseId: e.courseId,
      courseTitle: e.course?.title?.['fa'] ?? '',
      userPhone: e.user?.phone ?? '',
      userEmail: e.user?.email ?? '',
      enrolledAt: e.enrolledAt,
    }));

    return {
      totalUsers,
      totalCourses,
      totalArticles,
      totalEnrollments,
      pendingCourseComments,
      pendingArticleComments,
      recentEnrollments,
    };
  }

  async getUsers(page: number, limit: number, search?: string) {
    const repo = this.dataSource.getRepository(UserEntity);
    const qb = repo.createQueryBuilder('u');

    if (search) {
      qb.where('u.phone ILIKE :s OR u.email ILIKE :s', { s: `%${search}%` });
    }

    const [data, total] = await qb
      .orderBy('u.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async updateUserRole(userId: number, role: string) {
    await this.dataSource.getRepository(UserEntity).update(userId, { role: role as any });
  }

  async getCourses(page: number, limit: number) {
    const repo = this.dataSource.getRepository(CourseEntity);
    const [courses, total] = await repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: { instructor: true },
    });

    const data = courses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      status: c.status,
      price: c.price,
      studentCount: c.studentCount,
      publishedAt: c.publishedAt,
      instructorName: c.instructor?.displayName?.['fa'] ?? c.instructor?.phone ?? '',
    }));

    return { data, total };
  }

  async getCourseById(id: number) {
    return this.dataSource.getRepository(CourseEntity).findOne({
      where: { id },
      relations: { chapters: true, instructor: true, category: true },
    });
  }

  async createCourse(dto: Record<string, any>) {
    const repo = this.dataSource.getRepository(CourseEntity);
    const course = repo.create({
      title: {
        fa: dto['title_fa'] ?? '',
        en: dto['title_en'] ?? '',
        ps: dto['title_ps'] ?? '',
      },
      slug: dto['slug'] || slugify(dto['title_fa'] ?? '') || `course-${Date.now()}`,
      shortDescription: {
        fa: dto['shortDescription_fa'] ?? '',
        en: dto['shortDescription_en'] ?? '',
        ps: dto['shortDescription_ps'] ?? '',
      },
      price: parseInt(dto['price'] ?? '0', 10),
      discountPrice: dto['discountPrice'] ? parseInt(dto['discountPrice'], 10) : null,
      level: dto['level'] ?? 'all_levels',
      status: (dto['status'] ?? 'draft') as CourseStatus,
      categoryId: dto['categoryId'] ? parseInt(dto['categoryId'], 10) : null,
      instructorId: parseInt(dto['instructorId'] ?? '0', 10),
      previewVideo: dto['previewVideo'] ?? null,
      sortOrder: parseInt(dto['sortOrder'] ?? '0', 10),
    });
    const saved = await repo.save(course);
    void this.courseService.renewCourseCache();
    return saved;
  }

  async updateCourse(id: number, dto: Record<string, any>) {
    const repo = this.dataSource.getRepository(CourseEntity);
    const course = await repo.findOneOrFail({ where: { id } });

    if (dto['title_fa'] !== undefined) {
      course.title = {
        fa: dto['title_fa'] ?? '',
        en: dto['title_en'] ?? '',
        ps: dto['title_ps'] ?? '',
      };
    }
    if (dto['slug']) course.slug = dto['slug'];
    if (dto['shortDescription_fa'] !== undefined) {
      course.shortDescription = {
        fa: dto['shortDescription_fa'] ?? '',
        en: dto['shortDescription_en'] ?? '',
        ps: dto['shortDescription_ps'] ?? '',
      };
    }
    if (dto['price'] !== undefined) course.price = parseInt(dto['price'], 10);
    if (dto['discountPrice'] !== undefined) {
      course.discountPrice = dto['discountPrice'] ? parseInt(dto['discountPrice'], 10) : null;
    }
    if (dto['level']) course.level = dto['level'] as any;
    if (dto['status']) course.status = dto['status'] as CourseStatus;
    if (dto['categoryId'] !== undefined) {
      course.categoryId = dto['categoryId'] ? parseInt(dto['categoryId'], 10) : null;
    }
    if (dto['instructorId']) course.instructorId = parseInt(dto['instructorId'], 10);
    if (dto['previewVideo'] !== undefined) course.previewVideo = dto['previewVideo'] ?? null;
    if (dto['sortOrder'] !== undefined) course.sortOrder = parseInt(dto['sortOrder'] ?? '0', 10);

    const saved = await repo.save(course);
    void this.courseService.renewCourseCache();
    return saved;
  }

  async deleteCourse(id: number) {
    await this.dataSource.getRepository(CourseEntity).softDelete(id);
    void this.courseService.renewCourseCache();
  }

  async updateCourseStatus(id: number, status: string) {
    const repo = this.dataSource.getRepository(CourseEntity);
    const update: Record<string, any> = { status };
    if (status === CourseStatus.PUBLISHED) {
      update['publishedAt'] = new Date();
    }
    await repo.update(id, update);
    void this.courseService.renewCourseCache();
  }

  async getArticles(page: number, limit: number) {
    const repo = this.dataSource.getRepository(ArticleEntity);
    const [articles, total] = await repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: { author: true },
    });

    const data = articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      status: a.status,
      viewCount: a.viewCount,
      publishedAt: a.publishedAt,
      authorName: a.author?.displayName?.['fa'] ?? a.author?.phone ?? '',
    }));

    return { data, total };
  }

  async getArticleById(id: number) {
    return this.dataSource.getRepository(ArticleEntity).findOne({
      where: { id },
      relations: { author: true, category: true },
    });
  }

  async createArticle(dto: Record<string, any>) {
    const repo = this.dataSource.getRepository(ArticleEntity);
    const article = repo.create({
      title: {
        fa: dto['title_fa'] ?? '',
        en: dto['title_en'] ?? '',
        ps: dto['title_ps'] ?? '',
      },
      slug: dto['slug'] || slugify(dto['title_fa'] ?? '') || `article-${Date.now()}`,
      shortDescription: {
        fa: dto['shortDescription_fa'] ?? '',
        en: dto['shortDescription_en'] ?? '',
        ps: dto['shortDescription_ps'] ?? '',
      },
      body: {
        fa: dto['body_fa'] ?? '',
        en: dto['body_en'] ?? '',
        ps: dto['body_ps'] ?? '',
      },
      status: (dto['status'] ?? 'draft') as ArticleStatus,
      readTime: parseInt(dto['readTime'] ?? '0', 10),
      categoryId: dto['categoryId'] ? parseInt(dto['categoryId'], 10) : null,
      authorId: parseInt(dto['authorId'] ?? '0', 10),
      sortOrder: parseInt(dto['sortOrder'] ?? '0', 10),
    });
    const saved = await repo.save(article);
    void this.articleService.renewArticleCache();
    return saved;
  }

  async updateArticle(id: number, dto: Record<string, any>) {
    const repo = this.dataSource.getRepository(ArticleEntity);
    const article = await repo.findOneOrFail({ where: { id } });

    if (dto['title_fa'] !== undefined) {
      article.title = {
        fa: dto['title_fa'] ?? '',
        en: dto['title_en'] ?? '',
        ps: dto['title_ps'] ?? '',
      };
    }
    if (dto['slug']) article.slug = dto['slug'];
    if (dto['shortDescription_fa'] !== undefined) {
      article.shortDescription = {
        fa: dto['shortDescription_fa'] ?? '',
        en: dto['shortDescription_en'] ?? '',
        ps: dto['shortDescription_ps'] ?? '',
      };
    }
    if (dto['body_fa'] !== undefined) {
      article.body = {
        fa: dto['body_fa'] ?? '',
        en: dto['body_en'] ?? '',
        ps: dto['body_ps'] ?? '',
      };
    }
    if (dto['status']) article.status = dto['status'] as ArticleStatus;
    if (dto['readTime'] !== undefined) article.readTime = parseInt(dto['readTime'] ?? '0', 10);
    if (dto['categoryId'] !== undefined) {
      article.categoryId = dto['categoryId'] ? parseInt(dto['categoryId'], 10) : null;
    }
    if (dto['authorId']) article.authorId = parseInt(dto['authorId'], 10);
    if (dto['sortOrder'] !== undefined) article.sortOrder = parseInt(dto['sortOrder'] ?? '0', 10);

    const saved = await repo.save(article);
    void this.articleService.renewArticleCache();
    return saved;
  }

  async deleteArticle(id: number) {
    await this.dataSource.getRepository(ArticleEntity).softDelete(id);
    void this.articleService.renewArticleCache();
  }

  async updateArticleStatus(id: number, status: string) {
    const repo = this.dataSource.getRepository(ArticleEntity);
    const update: Record<string, any> = { status };
    if (status === ArticleStatus.PUBLISHED) {
      update['publishedAt'] = new Date();
    }
    await repo.update(id, update);
    void this.articleService.renewArticleCache();
  }

  async getCategories() {
    const repo = this.dataSource.getRepository(CategoryEntity);
    const cats = await repo.find({ order: { sortOrder: 'ASC', createdAt: 'ASC' }, relations: { parent: true } });
    return cats.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      sortOrder: c.sortOrder,
      isActive: c.isActive,
      parentId: c.parentId,
      parentTitle: c.parent?.title?.['fa'] ?? null,
    }));
  }

  async createCategory(dto: Record<string, any>) {
    const repo = this.dataSource.getRepository(CategoryEntity);
    const cat = repo.create({
      title: {
        fa: dto['title_fa'] ?? '',
        en: dto['title_en'] ?? '',
        ps: dto['title_ps'] ?? '',
      },
      slug: dto['slug'] || slugify(dto['title_fa'] ?? '') || `cat-${Date.now()}`,
      parentId: dto['parentId'] ? parseInt(dto['parentId'], 10) : null,
      sortOrder: parseInt(dto['sortOrder'] ?? '0', 10),
      isActive: dto['isActive'] !== 'false',
    });
    const saved = await repo.save(cat);
    void this.categoryService.invalidateCategoryCache();
    return saved;
  }

  async updateCategory(id: number, dto: Record<string, any>) {
    const repo = this.dataSource.getRepository(CategoryEntity);
    const cat = await repo.findOneOrFail({ where: { id } });

    if (dto['title_fa'] !== undefined) {
      cat.title = {
        fa: dto['title_fa'] ?? '',
        en: dto['title_en'] ?? '',
        ps: dto['title_ps'] ?? '',
      };
    }
    if (dto['slug']) cat.slug = dto['slug'];
    if (dto['parentId'] !== undefined) {
      cat.parentId = dto['parentId'] ? parseInt(dto['parentId'], 10) : null;
    }
    if (dto['sortOrder'] !== undefined) cat.sortOrder = parseInt(dto['sortOrder'] ?? '0', 10);

    const saved = await repo.save(cat);
    void this.categoryService.invalidateCategoryCache();
    return saved;
  }

  async toggleCategoryActive(id: number) {
    const repo = this.dataSource.getRepository(CategoryEntity);
    const cat = await repo.findOneOrFail({ where: { id } });
    cat.isActive = !cat.isActive;
    await repo.save(cat);
    void this.categoryService.invalidateCategoryCache();
    return { isActive: cat.isActive };
  }

  async deleteCategory(id: number) {
    await this.dataSource.getRepository(CategoryEntity).softDelete(id);
    void this.categoryService.invalidateCategoryCache();
  }

  async getComments(
    type: 'course' | 'article',
    status: string,
    page: number,
    limit: number,
  ) {
    if (type === 'course') {
      const repo = this.dataSource.getRepository(CourseCommentEntity);
      const qb = repo
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.user', 'u')
        .leftJoinAndSelect('c.course', 'course')
        .orderBy('c.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (status && status !== 'all') {
        qb.where('c.status = :status', { status });
      }

      const [data, total] = await qb.getManyAndCount();
      return {
        data: data.map((c) => ({
          id: c.id,
          body: c.body,
          status: c.status,
          rating: c.rating,
          createdAt: c.createdAt,
          userPhone: c.user?.phone ?? '',
          userEmail: c.user?.email ?? '',
          subjectTitle: c.course?.title?.['fa'] ?? '',
        })),
        total,
      };
    } else {
      const repo = this.dataSource.getRepository(ArticleCommentEntity);
      const qb = repo
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.user', 'u')
        .leftJoinAndSelect('c.article', 'article')
        .orderBy('c.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (status && status !== 'all') {
        qb.where('c.status = :status', { status });
      }

      const [data, total] = await qb.getManyAndCount();
      return {
        data: data.map((c) => ({
          id: c.id,
          body: c.body,
          status: c.status,
          rating: null,
          createdAt: c.createdAt,
          userPhone: c.user?.phone ?? '',
          userEmail: c.user?.email ?? '',
          subjectTitle: c.article?.title?.['fa'] ?? '',
        })),
        total,
      };
    }
  }

  async updateCourseCommentStatus(id: number, status: string) {
    await this.dataSource
      .getRepository(CourseCommentEntity)
      .update(id, { status: status as any });
  }

  async updateArticleCommentStatus(id: number, status: string) {
    await this.dataSource
      .getRepository(ArticleCommentEntity)
      .update(id, { status: status as any });
  }

  async getEnrollments(page: number, limit: number, search?: string) {
    const repo = this.dataSource.getRepository(CourseEnrollmentEntity);
    const qb = repo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.user', 'u')
      .leftJoinAndSelect('e.course', 'course')
      .orderBy('e.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.where('u.phone ILIKE :s OR u.email ILIKE :s', { s: `%${search}%` });
    }

    const [data, total] = await qb.getManyAndCount();
    return {
      data: data.map((e) => ({
        id: e.id,
        userId: e.userId,
        courseId: e.courseId,
        enrolledAt: e.enrolledAt,
        userPhone: e.user?.phone ?? '',
        userEmail: e.user?.email ?? '',
        courseTitle: e.course?.title?.['fa'] ?? '',
      })),
      total,
    };
  }

  async addEnrollment(courseId: number, userId: number) {
    const enrollRepo = this.dataSource.getRepository(CourseEnrollmentEntity);
    const courseRepo = this.dataSource.getRepository(CourseEntity);

    const enrollment = enrollRepo.create({
      courseId,
      userId,
      enrolledAt: new Date(),
    });
    await enrollRepo.save(enrollment);
    await courseRepo.increment({ id: courseId }, 'studentCount', 1);
    return enrollment;
  }

  async removeEnrollment(id: number) {
    const enrollRepo = this.dataSource.getRepository(CourseEnrollmentEntity);
    const enrollment = await enrollRepo.findOne({ where: { id } });
    if (enrollment) {
      await enrollRepo.delete(id);
      const courseRepo = this.dataSource.getRepository(CourseEntity);
      await courseRepo.decrement({ id: enrollment.courseId }, 'studentCount', 1);
    }
  }

  async getCoursesSimple() {
    const courses = await this.dataSource.getRepository(CourseEntity).find({
      select: { id: true, title: true },
      order: { createdAt: 'DESC' },
    });
    return courses.map((c) => ({ id: c.id, title: c.title?.['fa'] ?? '' }));
  }

  async getUsersSimple(search?: string) {
    const qb = this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('u')
      .select(['u.id', 'u.phone', 'u.email']);

    if (search) {
      qb.where('u.phone ILIKE :s OR u.email ILIKE :s', { s: `%${search}%` });
    }
    return qb.take(20).getMany();
  }

  async getCategoriesForSelect() {
    const cats = await this.getCategories();
    const result: Array<(typeof cats)[0] & { depth: number }> = [];
    function addChildren(parentId: number | null, depth: number) {
      cats
        .filter((c) => c.parentId === parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .forEach((cat) => {
          result.push({ ...cat, depth });
          addChildren(cat.id, depth + 1);
        });
    }
    addChildren(null, 0);
    return result;
  }

  async getChaptersByCourse(courseId: number) {
    const chapters = await this.dataSource
      .getRepository(CourseChapterEntity)
      .find({
        where: { courseId },
        order: { sortOrder: 'ASC', createdAt: 'ASC' },
        relations: { episodes: true },
      });
    return chapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      sortOrder: ch.sortOrder,
      isActive: ch.isActive,
      episodes: (ch.episodes ?? [])
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((ep) => ({
          id: ep.id,
          title: ep.title,
          slug: ep.slug,
          status: ep.status,
          isFree: ep.isFree,
          videoDuration: ep.videoDuration,
          sortOrder: ep.sortOrder,
          chapterId: ep.chapterId,
        })),
    }));
  }

  async createChapter(courseId: number, dto: Record<string, any>) {
    const repo = this.dataSource.getRepository(CourseChapterEntity);
    const ch = repo.create({
      courseId,
      title: { fa: dto['title_fa'] ?? '', en: dto['title_en'] ?? '', ps: dto['title_ps'] ?? '' },
      sortOrder: parseInt(dto['sortOrder'] ?? '0', 10),
      isActive: dto['isActive'] !== false && dto['isActive'] !== 'false',
    });
    return repo.save(ch);
  }

  async updateChapter(id: number, dto: Record<string, any>) {
    const repo = this.dataSource.getRepository(CourseChapterEntity);
    const ch = await repo.findOneOrFail({ where: { id } });
    if (dto['title_fa'] !== undefined) {
      ch.title = { fa: dto['title_fa'] ?? '', en: dto['title_en'] ?? '', ps: dto['title_ps'] ?? '' };
    }
    if (dto['sortOrder'] !== undefined) ch.sortOrder = parseInt(dto['sortOrder'], 10);
    if (dto['isActive'] !== undefined) ch.isActive = dto['isActive'] !== false && dto['isActive'] !== 'false';
    return repo.save(ch);
  }

  async deleteChapter(id: number) {
    await this.dataSource.getRepository(CourseChapterEntity).softDelete(id);
  }

  async createEpisode(courseId: number, dto: Record<string, any>) {
    const repo = this.dataSource.getRepository(CourseEpisodeEntity);
    const ep = repo.create({
      courseId,
      chapterId: dto['chapterId'] ? parseInt(dto['chapterId'], 10) : null,
      title: { fa: dto['title_fa'] ?? '', en: dto['title_en'] ?? '', ps: dto['title_ps'] ?? '' },
      slug: dto['slug'] || slugify(dto['title_fa'] ?? '') || `ep-${Date.now()}`,
      description: dto['description_fa']
        ? { fa: dto['description_fa'] ?? '', en: dto['description_en'] ?? '', ps: dto['description_ps'] ?? '' }
        : null,
      videoUrl: dto['videoUrl'] ?? null,
      videoDuration: dto['videoDuration'] ? parseInt(dto['videoDuration'], 10) : null,
      attachmentUrl: dto['attachmentUrl'] ?? null,
      sortOrder: parseInt(dto['sortOrder'] ?? '0', 10),
      isFree: dto['isFree'] === true || dto['isFree'] === 'true',
      status: (dto['status'] ?? EpisodeStatus.DRAFT) as EpisodeStatus,
    });
    return repo.save(ep);
  }

  async updateEpisode(id: number, dto: Record<string, any>) {
    const repo = this.dataSource.getRepository(CourseEpisodeEntity);
    const ep = await repo.findOneOrFail({ where: { id } });
    if (dto['title_fa'] !== undefined) {
      ep.title = { fa: dto['title_fa'] ?? '', en: dto['title_en'] ?? '', ps: dto['title_ps'] ?? '' };
    }
    if (dto['slug']) ep.slug = dto['slug'];
    if (dto['description_fa'] !== undefined) {
      ep.description = { fa: dto['description_fa'] ?? '', en: dto['description_en'] ?? '', ps: dto['description_ps'] ?? '' };
    }
    if (dto['videoUrl'] !== undefined) ep.videoUrl = dto['videoUrl'] || null;
    if (dto['videoDuration'] !== undefined) ep.videoDuration = dto['videoDuration'] ? parseInt(dto['videoDuration'], 10) : null;
    if (dto['attachmentUrl'] !== undefined) ep.attachmentUrl = dto['attachmentUrl'] || null;
    if (dto['sortOrder'] !== undefined) ep.sortOrder = parseInt(dto['sortOrder'], 10);
    if (dto['isFree'] !== undefined) ep.isFree = dto['isFree'] === true || dto['isFree'] === 'true';
    if (dto['status']) ep.status = dto['status'] as EpisodeStatus;
    if (dto['chapterId'] !== undefined) ep.chapterId = dto['chapterId'] ? parseInt(dto['chapterId'], 10) : null;
    return repo.save(ep);
  }

  async deleteEpisode(id: number) {
    await this.dataSource.getRepository(CourseEpisodeEntity).softDelete(id);
  }

  async getEpisodeById(id: number) {
    return this.dataSource.getRepository(CourseEpisodeEntity).findOne({ where: { id } });
  }
}
