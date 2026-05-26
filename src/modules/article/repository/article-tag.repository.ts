import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { ArticleTagEntity } from '@modules/article/entity/article-tag.entity';

@Injectable()
export class ArticleTagRepository extends BaseRepository<ArticleTagEntity> {
  constructor(
    @InjectRepository(ArticleTagEntity)
    repository: Repository<ArticleTagEntity>,
  ) {
    super(repository);
  }
}
