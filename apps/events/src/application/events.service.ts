import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CacheService, EventQueryFilters } from '@app/repository';
import { Event } from '../domain/event.entity';
import { EVENT_REPOSITORY, IEventRepository } from '../domain/event.repository';

/**
 * Application service / use cases for the Events bounded context.
 * Orchestrates the domain and the custom repository; depends only on the port.
 */
@Injectable()
export class EventsService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
    private readonly cache: CacheService,
  ) {}

  async record(input: {
    source: string;
    type: string;
    severity: string;
    payload?: Record<string, unknown>;
  }): Promise<Event> {
    const event = new Event(input);
    const saved = await this.eventRepository.save(event);
    await this.cache.invalidatePattern('events:list:*');
    return saved;
  }

  async getById(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return event;
  }

  /** Cached list query, demonstrating the Redis caching layer. */
  async search(filters: EventQueryFilters): Promise<Event[]> {
    const cacheKey = `events:list:${JSON.stringify(filters)}`;
    return this.cache.wrap(cacheKey, () => this.eventRepository.search(filters), 30);
  }

  async remove(id: string): Promise<void> {
    const removed = await this.eventRepository.remove(id);
    if (!removed) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    await this.cache.invalidatePattern('events:list:*');
  }
}
