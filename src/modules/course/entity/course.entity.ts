import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AppDateColumn } from '@common/entity/app-date.column';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';
import { CategoryEntity } from '@modules/category/entity/category.entity';
import { UserEntity } from '@modules/auth/entity/user.entity';
import { CourseLevel } from '@modules/course/enum/course-level.enum';
import { CourseStatus } from '@modules/course/enum/course-status.enum';
import { CourseChapterEntity } from './course-chapter.entity';
import { CourseEpisodeEntity } from './course-episode.entity';
import { CourseTagEntity } from './course-tag.entity';

@Entity({ name: ModelEnum.COURSE, schema: SchemaEnum.PUBLIC })
export class CourseEntity extends BaseEntity {
  @Column({ type: 'jsonb' })
  title!: Record<string, string>;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 200 })
  slug!: string;

  @Column({ name: 'short_description', type: 'jsonb', nullable: true })
  shortDescription!: Record<string, string> | null;

  @Column({ type: 'jsonb', nullable: true })
  description!: Record<string, string> | null;

  @Column({ type: 'jsonb', nullable: true })
  thumbnail!: Record<string, string> | null;

  @Column({ name: 'preview_video', type: 'varchar', length: 500, nullable: true })
  previewVideo!: string | null;

  /** Price in Tomans; 0 means free */
  @Column({ type: 'int', default: 0 })
  price!: number;

  @Column({ name: 'discount_price', type: 'int', nullable: true })
  discountPrice!: number | null;

  @Column({ type: 'enum', enum: CourseLevel, default: CourseLevel.ALL_LEVELS })
  level!: CourseLevel;

  @Index()
  @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.DRAFT })
  status!: CourseStatus;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  /** Denormalized: updated on enroll/unenroll */
  @Column({ name: 'student_count', type: 'int', default: 0 })
  studentCount!: number;

  /** Total duration in seconds (denormalized, updated when episodes change) */
  @Column({ name: 'total_duration', type: 'int', default: 0 })
  totalDuration!: number;

  /** Total published episodes (denormalized) */
  @Column({ name: 'total_episodes', type: 'int', default: 0 })
  totalEpisodes!: number;

  @AppDateColumn({ name: 'published_at', nullable: true })
  publishedAt!: Date | null;

  @Index()
  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId!: number | null;

  @Index()
  @Column({ name: 'instructor_id', type: 'int' })
  instructorId!: number;

  @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'instructor_id' })
  instructor!: UserEntity;

  @OneToMany(() => CourseChapterEntity, (chapter) => chapter.course)
  chapters!: CourseChapterEntity[];

  @OneToMany(() => CourseEpisodeEntity, (episode) => episode.course)
  episodes!: CourseEpisodeEntity[];

  @OneToMany(() => CourseTagEntity, (tag) => tag.course)
  tags!: CourseTagEntity[];

  get isFree(): boolean {
    return this.price === 0;
  }

  get effectivePrice(): number {
    return this.discountPrice ?? this.price;
  }

  get hasDiscount(): boolean {
    return this.discountPrice !== null && this.discountPrice < this.price;
  }
}
