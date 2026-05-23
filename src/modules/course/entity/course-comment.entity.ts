import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';
import { UserEntity } from '@modules/auth/entity/user.entity';
import { CommentStatus } from '@modules/course/enum/comment-status.enum';
import { CourseEntity } from './course.entity';

@Entity({ name: ModelEnum.COURSE_COMMENT, schema: SchemaEnum.PUBLIC })
export class CourseCommentEntity extends BaseEntity {
  @Index()
  @Column({ name: 'course_id', type: 'int' })
  courseId!: number;

  @Index()
  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId!: number | null;

  @Column({ type: 'text' })
  body!: string;

  /** 1–5; only allowed on root (parentId = null) comments */
  @Column({ type: 'smallint', nullable: true })
  rating!: number | null;

  @Column({ type: 'varchar', length: 20, default: CommentStatus.PENDING })
  status!: CommentStatus;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: CourseEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => CourseCommentEntity, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent!: CourseCommentEntity | null;

  @OneToMany(() => CourseCommentEntity, (comment) => comment.parent)
  replies!: CourseCommentEntity[];
}
