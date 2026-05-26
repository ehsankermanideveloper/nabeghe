import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AppDateColumn } from '@common/entity/app-date.column';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';
import { CategoryEntity } from '@modules/category/entity/category.entity';
import { UserEntity } from '@modules/auth/entity/user.entity';
import { ArticleStatus } from '@modules/article/enum/article-status.enum';
import { ArticleCommentEntity } from './article-comment.entity';
import { ArticleTagEntity } from './article-tag.entity';

@Entity({ name: ModelEnum.ARTICLE, schema: SchemaEnum.PUBLIC })
export class ArticleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  title!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 300 })
  slug!: string;

  @Column({ name: 'short_description', type: 'varchar', length: 600, nullable: true })
  shortDescription!: string | null;

  @Column({ type: 'text', nullable: true })
  body!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnail!: string | null;

  @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT })
  status!: ArticleStatus;

  @Column({ name: 'read_time', type: 'int', default: 0 })
  readTime!: number;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount!: number;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @AppDateColumn({ name: 'published_at', nullable: true })
  publishedAt!: Date | null;

  @Index()
  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId!: number | null;

  @Index()
  @Column({ name: 'author_id', type: 'int' })
  authorId!: number;

  @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity | null;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'author_id' })
  author!: UserEntity;

  @OneToMany(() => ArticleCommentEntity, (comment) => comment.article)
  comments!: ArticleCommentEntity[];

  @OneToMany(() => ArticleTagEntity, (tag) => tag.article)
  tags!: ArticleTagEntity[];
}
