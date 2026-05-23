import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { CommentStatus } from '@modules/course/enum/comment-status.enum';
import { CourseCommentEntity } from '@modules/course/entity/course-comment.entity';

@Injectable()
export class CourseCommentRepository extends BaseRepository<CourseCommentEntity> {
  constructor(
    @InjectRepository(CourseCommentEntity)
    repository: Repository<CourseCommentEntity>,
  ) {
    super(repository);
  }

  findApprovedByCourseId(courseId: number): Promise<CourseCommentEntity[]> {
    return this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect(
        'comment.replies',
        'reply',
        'reply.status = :status AND reply.deletedAt IS NULL',
        { status: CommentStatus.APPROVED },
      )
      .leftJoinAndSelect('reply.user', 'replyUser')
      .where('comment.courseId = :courseId', { courseId })
      .andWhere('comment.status = :status', { status: CommentStatus.APPROVED })
      .andWhere('comment.parentId IS NULL')
      .andWhere('comment.deletedAt IS NULL')
      .orderBy('comment.createdAt', 'DESC')
      .getMany();
  }

  async getAverageRating(courseId: number): Promise<number | null> {
    const result = await this.createQueryBuilder('comment')
      .select('AVG(comment.rating)', 'avg')
      .where('comment.courseId = :courseId', { courseId })
      .andWhere('comment.status = :status', { status: CommentStatus.APPROVED })
      .andWhere('comment.rating IS NOT NULL')
      .andWhere('comment.parentId IS NULL')
      .andWhere('comment.deletedAt IS NULL')
      .getRawOne<{ avg: string | null }>();

    if (!result?.avg) return null;
    return Math.round(parseFloat(result.avg) * 10) / 10;
  }

  countApprovedRatingsByCourseId(courseId: number): Promise<number> {
    return this.createQueryBuilder('comment')
      .where('comment.courseId = :courseId', { courseId })
      .andWhere('comment.status = :status', { status: CommentStatus.APPROVED })
      .andWhere('comment.parentId IS NULL')
      .andWhere('comment.deletedAt IS NULL')
      .getCount();
  }

  hasUserCommented(userId: number, courseId: number): Promise<boolean> {
    return this.createQueryBuilder('comment')
      .where('comment.userId = :userId', { userId })
      .andWhere('comment.courseId = :courseId', { courseId })
      .andWhere('comment.parentId IS NULL')
      .andWhere('comment.deletedAt IS NULL')
      .getExists();
  }
}
