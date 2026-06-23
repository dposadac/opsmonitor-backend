import { EventQueryFilters, PaginatedResult } from '@app/repository';
import { EventMonitor } from './event.entity';
import { UpdateEventDto } from '../presentation/dto/update-event.dto';

/** DI token for the Events repository port. */
export const EVENT_REPOSITORY = Symbol('EVENT_REPOSITORY');

/**
 * Filters + pagination params for listing events.
 * Field names mirror the domain aggregate (not the persistence layer).
 */
export interface EventListFilters {
  originApplication?: string;
  eventType?: string;
  severity?: string;
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
}

/**
 * Custom repository port for the Events aggregate. Defined by the domain,
 * implemented in the infrastructure layer on top of the shared DAL.
 */
export interface IEventRepository {
  save(event: EventMonitor): Promise<EventMonitor>;
  findById(id: string): Promise<EventMonitor | null>;
  search(filters: EventQueryFilters): Promise<EventMonitor[]>;
  findPaginated(filters: EventListFilters): Promise<PaginatedResult<EventMonitor>>;
  remove(id: string): Promise<boolean>;
  updateEvent(id: string, dto: UpdateEventDto): Promise<EventMonitor | null>;
}
