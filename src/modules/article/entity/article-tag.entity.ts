import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';
import { ArticleEntity } from './article.entity';

@Entity({ name: ModelEnum.ARTICLE_TAG, schema: SchemaEnum.PUBLIC })
export class ArticleTagEntity extends BaseEntity {
  @Index()
  @Column({ name: 'article_id', type: 'int' })
  articleId!: number;

  @Column({ type: 'varchar', length: 100 })
  title!: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  slug!: string;

  @ManyToOne(() => ArticleEntity, (a) => a.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article!: ArticleEntity;
}
