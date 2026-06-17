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
  ): Promise<{ user: UserEntity; isNew: boolean }> {
    const existing = await this.findByIdentifier(parsed);
    if (existing) {
      return { user: existing, isNew: false };
    }

    const created = this.build(
      parsed.kind === 'email'
        ? { email: parsed.normalized, phone: null }
        : { phone: parsed.normalized, email: null },
    );
    const user = (await this.save(created)) as UserEntity;
    return { user, isNew: true };
  }

  findByGoogleId(googleId: string): Promise<UserEntity | null> {
    return this.findOne({ where: { googleId } });
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ where: { email } });
  }

  async findOrCreateByGoogle(profile: {
    googleId: string;
    email: string;
    displayName: string | null;
  }): Promise<{ user: UserEntity; isNew: boolean }> {
    const byGoogleId = await this.findByGoogleId(profile.googleId);
    if (byGoogleId) return { user: byGoogleId, isNew: false };

    // Link to existing account if email already registered
    const byEmail = profile.email ? await this.findByEmail(profile.email) : null;
    if (byEmail) {
      await this.updateOneById(byEmail.id, { googleId: profile.googleId });
      byEmail.googleId = profile.googleId;
      return { user: byEmail, isNew: false };
    }

    const created = this.build({
      googleId: profile.googleId,
      email: profile.email,
      phone: null,
      displayName: profile.displayName ? { fa: profile.displayName } : null,
    });
    const user = (await this.save(created)) as UserEntity;
    return { user, isNew: true };
  }
}
