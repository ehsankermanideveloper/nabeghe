import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { OtpChallengeEntity } from '@modules/auth/entity/otp-challenge.entity';

@Injectable()
export class OtpChallengeRepository extends BaseRepository<OtpChallengeEntity> {
  constructor(
    @InjectRepository(OtpChallengeEntity)
    repository: Repository<OtpChallengeEntity>,
  ) {
    super(repository);
  }

  findActiveById(id: number): Promise<OtpChallengeEntity | null> {
    return this.findOne({
      where: { id, consumedAt: IsNull() },
    });
  }
}
