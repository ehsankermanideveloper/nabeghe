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
import { CourseEntity } from './course.entity';
import { CourseEpisodeEntity } from './course-episode.entity';

@Entity({ name: ModelEnum.COURSE_CHAPTER, schema: SchemaEnum.PUBLIC })
export class CourseChapterEntity extends BaseEntity {
  @Index()
  @Column({ name: 'course_id', type: 'int' })
  courseId!: number;

  @Column({ type: 'jsonb' })
  title!: Record<string, string>;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => CourseEntity, (course) => course.chapters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: CourseEntity;

  @OneToMany(() => CourseEpisodeEntity, (episode) => episode.chapter)
  episodes!: CourseEpisodeEntity[];
}
