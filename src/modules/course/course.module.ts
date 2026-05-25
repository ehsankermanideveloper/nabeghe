import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '@modules/category/category.module';
import { CourseApiController } from '@modules/course/controller/course-api.controller';
import { CourseViewController } from '@modules/course/controller/course-view.controller';
import { CourseChapterEntity } from '@modules/course/entity/course-chapter.entity';
import { CourseCommentEntity } from '@modules/course/entity/course-comment.entity';
import { CourseEnrollmentEntity } from '@modules/course/entity/course-enrollment.entity';
import { CourseEpisodeEntity } from '@modules/course/entity/course-episode.entity';
import { CourseProgressEntity } from '@modules/course/entity/course-progress.entity';
import { CourseTagEntity } from '@modules/course/entity/course-tag.entity';
import { CourseWishlistEntity } from '@modules/course/entity/course-wishlist.entity';
import { CourseEntity } from '@modules/course/entity/course.entity';
import { EpisodeAccessGuard } from '@modules/course/guard/episode-access.guard';
import { CourseChapterRepository } from '@modules/course/repository/course-chapter.repository';
import { CourseCommentRepository } from '@modules/course/repository/course-comment.repository';
import { CourseEnrollmentRepository } from '@modules/course/repository/course-enrollment.repository';
import { CourseEpisodeRepository } from '@modules/course/repository/course-episode.repository';
import { CourseProgressRepository } from '@modules/course/repository/course-progress.repository';
import { CourseTagRepository } from '@modules/course/repository/course-tag.repository';
import { CourseWishlistRepository } from '@modules/course/repository/course-wishlist.repository';
import { CourseRepository } from '@modules/course/repository/course.repository';
import { CourseCommentService } from '@modules/course/service/course-comment.service';
import { CourseEnrollmentService } from '@modules/course/service/course-enrollment.service';
import { CourseEpisodeService } from '@modules/course/service/course-episode.service';
import { CourseProgressService } from '@modules/course/service/course-progress.service';
import { CourseWishlistService } from '@modules/course/service/course-wishlist.service';
import { CourseService } from '@modules/course/service/course.service';
import { CourseSeedService } from '@modules/course/seed/course-seed.service';

const entities = [
  CourseEntity,
  CourseChapterEntity,
  CourseEpisodeEntity,
  CourseEnrollmentEntity,
  CourseProgressEntity,
  CourseCommentEntity,
  CourseWishlistEntity,
  CourseTagEntity,
];

const repositories = [
  CourseRepository,
  CourseChapterRepository,
  CourseEpisodeRepository,
  CourseEnrollmentRepository,
  CourseProgressRepository,
  CourseCommentRepository,
  CourseWishlistRepository,
  CourseTagRepository,
];

const services = [
  CourseService,
  CourseEpisodeService,
  CourseEnrollmentService,
  CourseProgressService,
  CourseCommentService,
  CourseWishlistService,
  CourseSeedService,
];

@Module({
  imports: [TypeOrmModule.forFeature(entities), CategoryModule],
  controllers: [CourseViewController, CourseApiController],
  providers: [...repositories, ...services, EpisodeAccessGuard],
  exports: [CourseService, CourseEnrollmentService, CourseCommentService, CourseProgressService, CourseWishlistService],
})
export class CourseModule {}
