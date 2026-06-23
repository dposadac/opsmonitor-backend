import { Repository, SelectQueryBuilder } from 'typeorm';
import { IncidentsOrmEntity } from '../entities/typeorm/incident-entity';

export interface EventQueryFilters {
  source?: string;
  type?: string;
  severity?: string;
  from?: Date;
  to?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Encapsulates complex/optimized query construction for the Events table,
 * keeping conditional WHERE logic out of the repository methods.
 */
export class EventQueryBuilder {
  static build(
    repository: Repository<IncidentsOrmEntity>,
    filters: EventQueryFilters,
  ): SelectQueryBuilder<IncidentsOrmEntity> {
    const qb = repository.createQueryBuilder('event');

    if (filters.source) {
      qb.andWhere('event.source = :source', { source: filters.source });
    }
    if (filters.type) {
      qb.andWhere('event.type = :type', { type: filters.type });
    }
    if (filters.severity) {
      qb.andWhere('event.severity = :severity', { severity: filters.severity });
    }
    if (filters.from) {
      qb.andWhere('event.occurredAt >= :from', { from: filters.from });
    }
    if (filters.to) {
      qb.andWhere('event.occurredAt <= :to', { to: filters.to });
    }

    qb.orderBy('event.occurredAt', 'DESC')
      .take(filters.limit ?? 50)
      .skip(filters.offset ?? 0);

    return qb;
  }
}
