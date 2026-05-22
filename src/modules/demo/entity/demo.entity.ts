import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@common/entity/base.entity';
import { ModelEnum, SchemaEnum } from '@common/enum/model.enum';

@Entity({ name: ModelEnum.DEMO, schema: SchemaEnum.PUBLIC })
export class DemoEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 500 })
  title!: string;
}
