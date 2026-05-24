import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';
import { EpisodeStatus } from '@modules/course/enum/episode-status.enum';
import { CourseEntity } from './course.entity';
import { CourseChapterEntity } from './course-chapter.entity';

@Entity({ name: ModelEnum.COURSE_EPISODE, schema: SchemaEnum.PUBLIC })
export class CourseEpisodeEntity extends BaseEntity {
  @Index()
  @Column({ name: 'course_id', type: 'int' })
  courseId!: number;

  @Column({ name: 'chapter_id', type: 'int', nullable: true })
  chapterId!: number | null;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Index()
  @Column({ type: 'varchar', length: 200 })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'video_url', type: 'varchar', length: 500, nullable: true })
  videoUrl!: string | null;

  /** Duration in seconds */
  @Column({ name: 'video_duration', type: 'int', nullable: true })
  videoDuration!: number | null;

  @Column({ name: 'attachment_url', type: 'varchar', length: 500, nullable: true })
  attachmentUrl!: string | null;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  /** Free preview episodes accessible without enrollment */
  @Column({ name: 'is_free', type: 'boolean', default: false })
  isFree!: boolean;

  @Column({ type: 'enum', enum: EpisodeStatus, default: EpisodeStatus.DRAFT })
  status!: EpisodeStatus;

  @ManyToOne(() => CourseEntity, (course) => course.episodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: CourseEntity;

  @ManyToOne(() => CourseChapterEntity, (chapter) => chapter.episodes, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'chapter_id' })
  chapter!: CourseChapterEntity | null;

  get formattedDuration(): string {
    if (!this.videoDuration) return '—';
    const m = Math.floor(this.videoDuration / 60);
    const s = this.videoDuration % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
