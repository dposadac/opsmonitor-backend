/**
 * Generic contract that every repository (TypeORM, Mongoose, Redis) honors.
 * Apps depend on this abstraction, never on a concrete persistence technology.
 * `TDomain` is the type returned to the application layer (a domain aggregate),
 * decoupled from the underlying persistence model.
 */
export interface IBaseRepository<TDomain, TId = string> {
  create(entity: Partial<TDomain>): Promise<TDomain>;
  findById(id: TId): Promise<TDomain | null>;
  findAll(filter?: Record<string, unknown>): Promise<TDomain[]>;
  update(id: TId, partial: Partial<TDomain>): Promise<TDomain | null>;
  delete(id: TId): Promise<boolean>;
}
