import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  CacheService,
  EVENT_INCIDENT_JOB,
  EVENT_INCIDENT_QUEUE,
  EventIncidentJobPayload,
  EventQueryFilters,
  PaginatedResult,
} from '@app/repository';
import {
  EVENT_REPOSITORY,
  EventListFilters,
  IEventRepository,
} from '../domain/event.repository';
import { EventMonitor } from '../domain/event.entity';
import { UpdateEventDto } from '../presentation/dto/update-event.dto';

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
    @InjectQueue(EVENT_INCIDENT_QUEUE)
    private readonly eventIncidentQueue: Queue<EventIncidentJobPayload>,
  ) {}

  async record(input: any): Promise<EventMonitor> {
    const event = new EventMonitor(input);
    const saved = await this.eventRepository.save(event);

    // Publica el evento en la cola `event-incident-queue` para que la app de
    // Alerts lo consuma y genere la alerta correspondiente.
    await this.eventIncidentQueue.add(EVENT_INCIDENT_JOB, {
      eventId: saved.id as string,
      affectedApplication: saved.originApplication,
      severity: saved.severity.value,
    });

    return saved;
  }

  async getById(id: string): Promise<EventMonitor> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return event;
  }

  /** Cached list query, demonstrating the Redis caching layer. */
  async search(filters: EventQueryFilters): Promise<EventMonitor[]> {
    const cacheKey = `events:list:${JSON.stringify(filters)}`;
    return this.cache.wrap(cacheKey, () => this.eventRepository.search(filters), 30);
  }

  /** Backend-paginated listing of events (filters + page/limit), cached briefly. */
  async list(filters: EventListFilters): Promise<PaginatedResult<EventMonitor>> {
    const cacheKey = `events:paginated:${JSON.stringify(filters)}`;
    return this.cache.wrap(
      cacheKey,
      () => this.eventRepository.findPaginated(filters),
      30,
    );
  }

  async remove(id: string): Promise<void> {
    const removed = await this.eventRepository.remove(id);
    if (!removed) {
      throw new NotFoundException(`Event ${id} not found`);
    }
  }

  async update(id: string, dto: UpdateEventDto): Promise<EventMonitor> {
    const updated = await this.eventRepository.updateEvent(id, dto);
    if (!updated) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    return updated;
  }
}
