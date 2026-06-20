import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Incident, IncidentPriority } from '../domain/incident.entity';
import {
  INCIDENT_REPOSITORY,
  IIncidentRepository,
} from '../domain/incident.repository';

/**
 * Application service / use cases for the Incidents bounded context.
 */
@Injectable()
export class IncidentsService {
  constructor(
    @Inject(INCIDENT_REPOSITORY)
    private readonly incidentRepository: IIncidentRepository,
  ) {}

  async open(input: {
    title: string;
    description?: string;
    priority?: string;
    relatedEventIds?: string[];
  }): Promise<Incident> {
    const incident = new Incident({
      title: input.title,
      description: input.description,
      priority: input.priority as IncidentPriority,
      relatedEventIds: input.relatedEventIds,
    });
    return this.incidentRepository.save(incident);
  }

  async getById(id: string): Promise<Incident> {
    const incident = await this.incidentRepository.findById(id);
    if (!incident) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
    return incident;
  }

  list(status?: string): Promise<Incident[]> {
    return status
      ? this.incidentRepository.findByStatus(status)
      : this.incidentRepository.findAll();
  }

  async resolve(id: string): Promise<Incident> {
    const incident = await this.getById(id);
    incident.resolve();
    const updated = await this.incidentRepository.update(id, incident);
    if (!updated) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.incidentRepository.remove(id);
    if (!removed) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
  }
}
