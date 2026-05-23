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
import { CourseEpisodeEntity } from './course-episode.entity';

@Unique(['userId', 'episodeId'])
@Entity({ name: ModelEnum.COURSE_PROGRESS, schema: SchemaEnum.PUBLIC })
export class CourseProgressEntity extends BaseEntity {
  @Index()
  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Index()
  @Column({ name: 'course_id', type: 'int' })
  courseId!: number;

  @Column({ name: 'episode_id', type: 'int' })
  episodeId!: number;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted!: boolean;

  /** Seconds watched */
  @Column({ name: 'watched_seconds', type: 'int', default: 0 })
  watchedSeconds!: number;

  @AppDateColumn({ name: 'last_watched_at' })
  lastWatchedAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => CourseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: CourseEntity;

  @ManyToOne(() => CourseEpisodeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'episode_id' })
  episode!: CourseEpisodeEntity;
}
