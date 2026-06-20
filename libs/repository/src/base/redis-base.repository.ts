import Redis from 'ioredis';
import { IBaseRepository } from './base-repository.interface';

/**
 * Abstract base repository for Redis-backed aggregates.
 * Records (`TRecord`, identified by `id`) are stored as JSON under
 * `${namespace}:${id}` and indexed in a `${namespace}:index` set for scans.
 * Maps records to domain aggregates (`TDomain`) via the abstract hooks.
 */
export abstract class RedisBaseRepository<
  TRecord extends { id: string },
  TDomain = TRecord,
> implements IBaseRepository<TDomain>
{
  protected abstract readonly namespace: string;
  /** Optional TTL in seconds for stored entities (undefined = persist forever). */
  protected readonly ttlSeconds?: number;

  protected constructor(protected readonly redis: Redis) {}

  protected abstract toDomain(record: TRecord): TDomain;
  protected abstract toRecord(domain: Partial<TDomain>): TRecord;

  protected key(id: string): string {
    return `${this.namespace}:${id}`;
  }

  protected indexKey(): string {
    return `${this.namespace}:index`;
  }

  private async store(record: TRecord): Promise<void> {
    const pipeline = this.redis.multi();
    pipeline.set(this.key(record.id), JSON.stringify(record));
    if (this.ttlSeconds) {
      pipeline.expire(this.key(record.id), this.ttlSeconds);
    }
    pipeline.sadd(this.indexKey(), record.id);
    await pipeline.exec();
  }

  async create(domain: Partial<TDomain>): Promise<TDomain> {
    const record = this.toRecord(domain);
    await this.store(record);
    return this.toDomain(record);
  }

  async findById(id: string): Promise<TDomain | null> {
    const raw = await this.redis.get(this.key(id));
    return raw ? this.toDomain(JSON.parse(raw) as TRecord) : null;
  }

  async findAll(): Promise<TDomain[]> {
    const ids = await this.redis.smembers(this.indexKey());
    if (ids.length === 0) return [];
    const raws = await this.redis.mget(ids.map((id) => this.key(id)));
    return raws
      .filter((raw): raw is string => raw !== null)
      .map((raw) => this.toDomain(JSON.parse(raw) as TRecord));
  }

  async update(id: string, partial: Partial<TDomain>): Promise<TDomain | null> {
    const raw = await this.redis.get(this.key(id));
    if (!raw) return null;
    const existing = this.toDomain(JSON.parse(raw) as TRecord);
    const merged = this.toRecord({ ...existing, ...partial });
    merged.id = id;
    await this.store(merged);
    return this.toDomain(merged);
  }

  async delete(id: string): Promise<boolean> {
    const pipeline = this.redis.multi();
    pipeline.del(this.key(id));
    pipeline.srem(this.indexKey(), id);
    const results = await pipeline.exec();
    const removed = results?.[0]?.[1] as number | undefined;
    return (removed ?? 0) > 0;
  }
}
