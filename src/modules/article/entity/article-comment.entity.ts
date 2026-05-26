import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';
import { UserEntity } from '@modules/auth/entity/user.entity';
import { ArticleCommentStatus } from '@modules/article/enum/article-comment-status.enum';
import { ArticleEntity } from './article.entity';

@Entity({ name: ModelEnum.ARTICLE_COMMENT, schema: SchemaEnum.PUBLIC })
export class ArticleCommentEntity extends BaseEntity {
  @Index()
  @Column({ name: 'article_id', type: 'int' })
  articleId!: number;

  @Index()
  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId!: number | null;

  @Column({ type: 'text' })
  body!: string;

  @Column({ type: 'enum', enum: ArticleCommentStatus, default: ArticleCommentStatus.PENDING })
  status!: ArticleCommentStatus;

  @ManyToOne(() => ArticleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article!: ArticleEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => ArticleCommentEntity, (c) => c.replies, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent!: ArticleCommentEntity | null;

  @OneToMany(() => ArticleCommentEntity, (c) => c.parent)
  replies!: ArticleCommentEntity[];
}
