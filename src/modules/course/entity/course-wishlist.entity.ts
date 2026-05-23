import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';
import { UserEntity } from '@modules/auth/entity/user.entity';
import { CourseEntity } from './course.entity';

@Unique(['userId', 'courseId'])
@Entity({ name: ModelEnum.COURSE_WISHLIST, schema: SchemaEnum.PUBLIC })
export class CourseWishlistEntity extends BaseEntity {
  @Index()
  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Index()
  @Column({ name: 'course_id', type: 'int' })
  courseId!: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: CourseEntity;
}
