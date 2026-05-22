import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { DemoEntity } from '@modules/demo/entity/demo.entity';

@Injectable()
export class DemoRepository extends BaseRepository<DemoEntity> {
  constructor(
    @InjectRepository(DemoEntity) repository: Repository<DemoEntity>,
  ) {
    super(repository);
  }
}
