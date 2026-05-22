import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  DeepPartial,
  FindOptionsWhere,
  EntityManager,
  InsertResult,
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import type { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import type { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import type { BaseEntity } from '../entity/base.entity';

export interface PagedResult<Entity> {
  data: Entity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export abstract class BaseRepository<Entity extends BaseEntity> {
  protected constructor(protected readonly repository: Repository<Entity>) {}

  getOrmRepository(): Repository<Entity> {
    return this.repository;
  }

  build(partial: DeepPartial<Entity>): Entity {
    return this.repository.create(partial);
  }

  merge(entity: Entity, patch: DeepPartial<Entity>): Entity {
    return this.repository.merge(entity, patch);
  }

  preload(entityLike: DeepPartial<Entity>): Promise<Entity | undefined> {
    return this.repository.preload(entityLike);
  }

  createQueryBuilder(alias: string): SelectQueryBuilder<Entity> {
    return this.repository.createQueryBuilder(alias);
  }

  async runInTransaction<R>(
    worker: (manager: EntityManager) => Promise<R>,
  ): Promise<R> {
    return this.repository.manager.transaction(worker);
  }

  protected whereById(id: number): FindOptionsWhere<Entity> {
    return { id } as unknown as FindOptionsWhere<Entity>;
  }

  async findOneById(
    id: number,
    opts?: Omit<FindOneOptions<Entity>, 'where'> & { withDeleted?: boolean },
  ): Promise<Entity | null> {
    const { withDeleted, ...rest } = opts ?? {};
    return this.repository.findOne({
      where: this.whereById(id),
      withDeleted,
      ...rest,
    });
  }

  async findOneByIdOrFail(
    id: number,
    opts?: Omit<FindOneOptions<Entity>, 'where'> & { withDeleted?: boolean },
  ): Promise<Entity> {
    const { withDeleted, ...rest } = opts ?? {};
    return this.repository.findOneOrFail({
      where: this.whereById(id),
      withDeleted,
      ...rest,
    });
  }

  async findOne(opts: FindOneOptions<Entity>): Promise<Entity | null> {
    return this.repository.findOne(opts);
  }

  async findOneOrFail(opts: FindOneOptions<Entity>): Promise<Entity> {
    return this.repository.findOneOrFail(opts);
  }

  async findMany(opts?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(opts);
  }

  async findAndCountMany(
    opts?: FindManyOptions<Entity>,
  ): Promise<[Entity[], number]> {
    return this.repository.findAndCount(opts);
  }

  async findPaged(
    page: number,
    limit: number,
    opts?: Omit<FindManyOptions<Entity>, 'skip' | 'take'>,
  ): Promise<PagedResult<Entity>> {
    const safeLimit = Math.max(1, Math.min(limit, 500));
    const safePage = Math.max(1, page);

    const [data, total] = await this.repository.findAndCount({
      ...opts,
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    });

    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    };
  }

  async count(where?: FindOptionsWhere<Entity>): Promise<number> {
    if (where === undefined) return this.repository.count();
    return this.repository.countBy(where);
  }

  async countWithOptions(opts?: FindManyOptions<Entity>): Promise<number> {
    return this.repository.count(opts);
  }

  async existsById(id: number, withDeleted = false): Promise<boolean> {
    return this.repository.exists({
      where: this.whereById(id),
      withDeleted,
    });
  }

  async save(
    payload: DeepPartial<Entity> | DeepPartial<Entity>[],
  ): Promise<Entity | Entity[]> {
    return this.repository.save(payload as never);
  }

  async remove(
    entityOrEntities: Entity | Entity[],
  ): Promise<Entity | Entity[]> {
    return Array.isArray(entityOrEntities)
      ? this.repository.remove(entityOrEntities)
      : this.repository.remove(entityOrEntities);
  }

  async softRemove(
    entityOrEntities: Entity | Entity[],
  ): Promise<Entity | Entity[]> {
    return Array.isArray(entityOrEntities)
      ? this.repository.softRemove(entityOrEntities)
      : this.repository.softRemove(entityOrEntities);
  }

  async recover(
    entityOrEntities: Entity | Entity[],
  ): Promise<Entity | Entity[]> {
    return Array.isArray(entityOrEntities)
      ? this.repository.recover(entityOrEntities)
      : this.repository.recover(entityOrEntities);
  }

  async upsert(
    entityOrEntities:
      | QueryDeepPartialEntity<Entity>
      | QueryDeepPartialEntity<Entity>[],
    conflictPathsOrOptions: string[] | UpsertOptions<Entity>,
  ): Promise<InsertResult> {
    return this.repository.upsert(entityOrEntities, conflictPathsOrOptions);
  }

  async updateOneById(
    id: number,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    return this.repository.update(this.whereById(id), partialEntity);
  }

  async update(
    criteria: FindOptionsWhere<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    return this.repository.update(criteria, partialEntity);
  }

  async delete(
    criteria: FindOptionsWhere<Entity> | string | string[],
  ): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async softDelete(
    criteria: FindOptionsWhere<Entity> | string | string[],
  ): Promise<UpdateResult> {
    return this.repository.softDelete(criteria);
  }

  async softDeleteById(id: number): Promise<UpdateResult> {
    return this.repository.softDelete(this.whereById(id));
  }

  async restoreById(id: number): Promise<UpdateResult> {
    return this.repository.restore(this.whereById(id));
  }
}
