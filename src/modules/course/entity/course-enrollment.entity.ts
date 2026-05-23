import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { AppDateColumn } from '@common/entity/app-date.column';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';
import { UserEntity } from '@modules/auth/entity/user.entity';
import { CourseEntity } from './course.entity';

@Unique(['courseId', 'userId'])
@Entity({ name: ModelEnum.COURSE_ENROLLMENT, schema: SchemaEnum.PUBLIC })
export class CourseEnrollmentEntity extends BaseEntity {
  @Index()
  @Column({ name: 'course_id', type: 'int' })
  courseId!: number;

  @Index()
  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @AppDateColumn({ name: 'enrolled_at' })
  enrolledAt!: Date;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: CourseEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
