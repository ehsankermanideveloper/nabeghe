import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { PasskeyEntity } from '@modules/auth/entity/passkey.entity';

@Injectable()
export class PasskeyRepository extends BaseRepository<PasskeyEntity> {
  constructor(
    @InjectRepository(PasskeyEntity)
    repository: Repository<PasskeyEntity>,
  ) {
    super(repository);
  }

  findByCredentialId(credentialId: string): Promise<PasskeyEntity | null> {
    return this.findOne({ where: { credentialId } });
  }

  findByUserId(userId: number): Promise<PasskeyEntity[]> {
    return this.findMany({ where: { userId }, order: { createdAt: 'DESC' } });
  }
}
