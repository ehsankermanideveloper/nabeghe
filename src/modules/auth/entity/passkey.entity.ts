import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';
import { UserEntity } from '@modules/auth/entity/user.entity';

@Entity({ name: ModelEnum.PASSKEY, schema: SchemaEnum.PUBLIC })
export class PasskeyEntity extends BaseEntity {
  @Index()
  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 512 })
  credentialId!: string;

  @Column({ type: 'bytea' })
  publicKey!: Buffer;

  @Column({
    type: 'bigint',
    default: 0,
    transformer: {
      to: (v: number): string => String(v),
      from: (v: string | number | null): number => {
        if (v === null) return 0;
        return typeof v === 'string' ? parseInt(v, 10) : v;
      },
    },
  })
  counter!: number;

  @Column({ type: 'varchar', length: 32 })
  deviceType!: string;

  @Column({ type: 'boolean', default: false })
  backedUp!: boolean;

  @Column({ type: 'text', nullable: true })
  transports!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  name!: string | null;
}
