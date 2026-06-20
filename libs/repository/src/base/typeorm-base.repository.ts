import {
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { IBaseRepository } from './base-repository.interface';

/**
 * Abstract base repository for TypeORM-backed aggregates.
 * Maps ORM rows (`TEntity`) to domain aggregates (`TDomain`) via the abstract
 * `toDomain` / `toEntity` hooks. Concrete repositories extend this and add
 * their own domain-specific query methods.
 */
export abstract class TypeOrmBaseRepository<
  TEntity extends ObjectLiteral,
  TDomain = TEntity,
> implements IBaseRepository<TDomain>
{
  protected constructor(protected readonly repository: Repository<TEntity>) {}

  protected abstract toDomain(entity: TEntity): TDomain;
  protected abstract toEntity(domain: Partial<TDomain>): DeepPartial<TEntity>;

  /** Returns a repository bound to a transactional EntityManager when provided. */
  protected scoped(manager?: EntityManager): Repository<TEntity> {
    return manager
      ? manager.getRepository<TEntity>(this.repository.target)
      : this.repository;
  }

  async create(domain: Partial<TDomain>, manager?: EntityManager): Promise<TDomain> {
    const repo = this.scoped(manager);
    const created = repo.create(this.toEntity(domain));
    const saved = await repo.save(created);
    return this.toDomain(saved);
  }

  async findById(id: string, manager?: EntityManager): Promise<TDomain | null> {
    const found = await this.scoped(manager).findOne({
      where: { id } as unknown as FindOptionsWhere<TEntity>,
    });
    return found ? this.toDomain(found) : null;
  }

  async findAll(
    filter: Record<string, unknown> = {},
    manager?: EntityManager,
  ): Promise<TDomain[]> {
    const rows = await this.scoped(manager).find({
      where: filter as FindOptionsWhere<TEntity>,
    });
    return rows.map((row) => this.toDomain(row));
  }

  async update(
    id: string,
    partial: Partial<TDomain>,
    manager?: EntityManager,
  ): Promise<TDomain | null> {
    const repo = this.scoped(manager);
    await repo.update(id, this.toEntity(partial) as never);
    return this.findById(id, manager);
  }

  async delete(id: string, manager?: EntityManager): Promise<boolean> {
    const result = await this.scoped(manager).delete(id);
    return (result.affected ?? 0) > 0;
  }
}
