import { Column, Entity, Index } from 'typeorm';
import { AppDateColumn } from '@common/entity/app-date.column';
import { BaseEntity } from '@common/entity/base.entity';
import { UserRole } from '@common/enum/user-role.enum';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';

@Entity({ name: ModelEnum.USER, schema: SchemaEnum.PUBLIC })
export class UserEntity extends BaseEntity {
  @Index({ unique: true, where: '"phone" IS NOT NULL' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Index({ unique: true, where: '"email" IS NOT NULL' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  displayName!: Record<string, string> | null;

  @Column({ type: 'varchar', length: 20, default: UserRole.STUDENT })
  role!: UserRole;

  @Column({ type: 'varchar', length: 10, nullable: true })
  birthday!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  bio!: string | null;

  @AppDateColumn({ nullable: true })
  lastLoginAt!: Date | null;
}
