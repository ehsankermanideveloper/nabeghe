import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypedConfigService } from '@common/config/typed-config.service';
import { UserRole } from '@common/enum/user-role.enum';
import { UserEntity } from '@modules/auth/entity/user.entity';
import { CategoryEntity } from '@modules/category/entity/category.entity';
import { CourseChapterRepository } from '@modules/course/repository/course-chapter.repository';
import { CourseEpisodeRepository } from '@modules/course/repository/course-episode.repository';
import { CourseRepository } from '@modules/course/repository/course.repository';
import { CourseStatus } from '@modules/course/enum/course-status.enum';
import { EpisodeStatus } from '@modules/course/enum/episode-status.enum';
import { CourseEntity } from '@modules/course/entity/course.entity';
import { COURSE_SEED_DATA } from '@modules/course/seed/course.seed-data';

@Injectable()
export class CourseSeedService implements OnModuleInit {
  private readonly logger = new Logger(CourseSeedService.name);

  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly chapterRepository: CourseChapterRepository,
    private readonly episodeRepository: CourseEpisodeRepository,
    private readonly config: TypedConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    const env = this.config.app.nodeEnv;
    if (env === 'production') return;

    const count = await this.courseRepository.count();
    if (count > 0) return;

    await this.seed();
    this.logger.log('Course seed data inserted.');
  }

  private async seed(): Promise<void> {
    const userRepo = this.dataSource.getRepository(UserEntity);
    const categoryRepo = this.dataSource.getRepository(CategoryEntity);

    let instructor = await userRepo.findOne({ where: { role: UserRole.LECTURER } });
    if (!instructor) {
      instructor = await userRepo.findOne({ where: {} });
    }
    if (!instructor) {
      const entity = userRepo.create({
        displayName: 'مدرس نابغه',
        email: 'instructor@nabeghe.ir',
        role: UserRole.LECTURER,
      });
      instructor = await userRepo.save(entity);
    }

    for (const data of COURSE_SEED_DATA) {
      const category = await categoryRepo.findOne({ where: { slug: data.categorySlug } });
      if (!category) {
        this.logger.warn(`Category not found for slug: ${data.categorySlug}, skipping course "${data.title}"`);
        continue;
      }

      const course = this.courseRepository.build({
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        thumbnail: data.thumbnail,
        previewVideo: data.previewVideo,
        price: data.price,
        discountPrice: data.discountPrice,
        level: data.level,
        status: CourseStatus.PUBLISHED,
        publishedAt: new Date(),
        categoryId: category.id,
        instructorId: instructor.id,
      });

      const savedCourse = (await this.courseRepository.save(course)) as CourseEntity;
      let totalEpisodes = 0;
      let totalDuration = 0;

      for (const chapterData of data.chapters) {
        const chapter = this.chapterRepository.build({
          courseId: savedCourse.id,
          title: chapterData.title,
          sortOrder: chapterData.sortOrder,
          isActive: true,
        });
        const savedChapter = await this.chapterRepository.save(chapter) as import('@modules/course/entity/course-chapter.entity').CourseChapterEntity;

        for (const epData of chapterData.episodes) {
          const episode = this.episodeRepository.build({
            courseId: savedCourse.id,
            chapterId: savedChapter.id,
            title: epData.title,
            slug: epData.slug,
            description: epData.description,
            videoUrl: epData.videoUrl,
            videoDuration: epData.videoDuration,
            isFree: epData.isFree,
            status: EpisodeStatus.PUBLISHED,
            sortOrder: epData.sortOrder,
          });
          await this.episodeRepository.save(episode);
          totalEpisodes++;
          totalDuration += epData.videoDuration;
        }
      }

      await this.courseRepository.updateOneById(savedCourse.id, {
        totalEpisodes,
        totalDuration,
      });
    }
  }
}
