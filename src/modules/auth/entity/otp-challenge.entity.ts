import { Column, Entity, Index } from 'typeorm';
import { AppDateColumn } from '@common/entity/app-date.column';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';

@Entity({ name: ModelEnum.OTP_CHALLENGE, schema: SchemaEnum.PUBLIC })
export class OtpChallengeEntity extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 255 })
  identifier!: string;

  @AppDateColumn()
  expiresAt!: Date;

  @Column({ type: 'int', default: 0 })
  attempts!: number;

  @AppDateColumn({ nullable: true })
  consumedAt!: Date | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress!: string | null;
}
