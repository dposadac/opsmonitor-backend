import { EventQueryFilters } from '@app/repository';
import { Event } from './event.entity';

/** DI token for the Events repository port. */
export const EVENT_REPOSITORY = Symbol('EVENT_REPOSITORY');

/**
 * Custom repository port for the Events aggregate. Defined by the domain,
 * implemented in the infrastructure layer on top of the shared DAL.
 */
export interface IEventRepository {
  save(event: Event): Promise<Event>;
  findById(id: string): Promise<Event | null>;
  search(filters: EventQueryFilters): Promise<Event[]>;
  remove(id: string): Promise<boolean>;
}
