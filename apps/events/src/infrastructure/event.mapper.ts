import { EventOrmEntity } from '@app/repository';
import { Event } from '../domain/event.entity';

/**
 * Translates between the domain aggregate and the TypeORM persistence model.
 */
export class EventMapper {
  static toDomain(orm: EventOrmEntity): Event {
    return new Event({
      id: orm.id,
      source: orm.source,
      type: orm.type,
      severity: orm.severity,
      payload: orm.payload,
      occurredAt: orm.occurredAt,
    });
  }

  static toPersistence(event: Event): Partial<EventOrmEntity> {
    return {
      id: event.id,
      source: event.source,
      type: event.type,
      severity: event.severity.value,
      payload: event.payload,
      occurredAt: event.occurredAt,
    };
  }
}
