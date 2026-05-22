import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { UserEntity } from '@modules/auth/entity/user.entity';
import type { ParsedIdentifier } from '@modules/auth/util/identifier.util';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  findByIdentifier(parsed: ParsedIdentifier): Promise<UserEntity | null> {
    if (parsed.kind === 'email') {
      return this.findOne({ where: { email: parsed.normalized } });
    }
    return this.findOne({ where: { phone: parsed.normalized } });
  }

  async findOrCreateByIdentifier(
    parsed: ParsedIdentifier,
  ): Promise<UserEntity> {
    const existing = await this.findByIdentifier(parsed);
    if (existing) {
      return existing;
    }

    const created = this.build(
      parsed.kind === 'email'
        ? { email: parsed.normalized, phone: null }
        : { phone: parsed.normalized, email: null },
    );
    return (await this.save(created)) as UserEntity;
  }
}
