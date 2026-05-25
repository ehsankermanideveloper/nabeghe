import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SubmitCommentDto } from '@modules/course/dto/submit-comment.dto';
import { CourseCommentEntity } from '@modules/course/entity/course-comment.entity';
import { CommentStatus } from '@modules/course/enum/comment-status.enum';
import { CourseCommentRepository } from '@modules/course/repository/course-comment.repository';
import { CourseRepository } from '@modules/course/repository/course.repository';

@Injectable()
export class CourseCommentService {
  constructor(
    private readonly commentRepository: CourseCommentRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async submit(
    userId: number,
    courseSlug: string,
    dto: SubmitCommentDto,
  ): Promise<CourseCommentEntity> {
    const course = await this.courseRepository.findPublishedBySlug(courseSlug);
    if (!course) throw new NotFoundException('دوره یافت نشد');

    if (!dto.parentId) {
      const alreadyCommented = await this.commentRepository.hasUserCommented(userId, course.id);
      if (alreadyCommented) {
        throw new BadRequestException('قبلاً نظر ثبت کرده‌اید');
      }
    }

    if (dto.parentId) {
      const parent = await this.commentRepository.findOneById(dto.parentId);
      if (!parent || parent.courseId !== course.id || parent.parentId !== null) {
        throw new BadRequestException('نظر والد معتبر نیست');
      }
    }

    const comment = this.commentRepository.build({
      courseId: course.id,
      userId,
      parentId: dto.parentId ?? null,
      body: dto.body,
      rating: dto.parentId ? null : (dto.rating ?? null),
      status: CommentStatus.PENDING,
    });

    return (await this.commentRepository.save(comment)) as CourseCommentEntity;
  }

  getApprovedComments(courseId?: number, limit?: number , sortAsc : boolean = true): Promise<CourseCommentEntity[]> {
    return this.commentRepository.findApprovedByCourseId(courseId , limit , sortAsc);
  }

  getAverageRating(courseId: number): Promise<number | null> {
    return this.commentRepository.getAverageRating(courseId);
  }

  getRatingCount(courseId: number): Promise<number> {
    return this.commentRepository.countApprovedRatingsByCourseId(courseId);
  }

  getMyComments(userId: number): Promise<CourseCommentEntity[]> {
    return this.commentRepository.findByUserId(userId);
  }
}
