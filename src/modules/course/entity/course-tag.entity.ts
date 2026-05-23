import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';
import { CourseEntity } from './course.entity';

@Entity({ name: ModelEnum.COURSE_TAG, schema: SchemaEnum.PUBLIC })
export class CourseTagEntity extends BaseEntity {
  @Index()
  @Column({ name: 'course_id', type: 'int' })
  courseId!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @ManyToOne(() => CourseEntity, (course) => course.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: CourseEntity;
}
