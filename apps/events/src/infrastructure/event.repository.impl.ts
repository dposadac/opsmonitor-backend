import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import {
  EventOrmEntity,
  EventQueryBuilder,
  EventQueryFilters,
  TypeOrmBaseRepository,
} from '@app/repository';
import { Event } from '../domain/event.entity';
import { IEventRepository } from '../domain/event.repository';
import { EventMapper } from './event.mapper';

/**
 * Custom Events repository: extends the shared TypeORM base repository and
 * implements the domain port. Mapping ORM rows <-> domain aggregates is wired
 * through the base class hooks.
 */
@Injectable()
export class EventRepositoryImpl
  extends TypeOrmBaseRepository<EventOrmEntity, Event>
  implements IEventRepository
{
  constructor(
    @InjectRepository(EventOrmEntity)
    private readonly events: Repository<EventOrmEntity>,
  ) {
    super(events);
  }

  protected toDomain(entity: EventOrmEntity): Event {
    return EventMapper.toDomain(entity);
  }

  protected toEntity(domain: Partial<Event>): DeepPartial<EventOrmEntity> {
    return EventMapper.toPersistence(domain as Event);
  }

  save(event: Event): Promise<Event> {
    return this.create(event);
  }

  async search(filters: EventQueryFilters): Promise<Event[]> {
    const rows = await EventQueryBuilder.build(this.events, filters).getMany();
    return rows.map((row) => this.toDomain(row));
  }

  remove(id: string): Promise<boolean> {
    return this.delete(id);
  }
}
