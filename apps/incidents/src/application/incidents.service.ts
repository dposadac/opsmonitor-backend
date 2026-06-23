import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpCrudService } from '@app/shared';
import { Incident } from '../domain/incident.entity';
import {
  INCIDENT_REPOSITORY,
  IIncidentRepository,
} from '../domain/incident.repository';
import { CreateIncidentDto } from '../presentation/dto/create-incident.dto';
import { UpdateIncidentDto } from '../presentation/dto/update-incident.dto';
import { QueryIncidentDto } from '../presentation/dto/query-incident.dto';
import { BulkUpdateIncidentsDto } from '../presentation/dto/bulk-update-incident.dto';

/**
 * Application service / use cases for the Incidents bounded context.
 */
@Injectable()
export class IncidentsService {
  constructor(
    @Inject(INCIDENT_REPOSITORY)
    private readonly incidentRepository: IIncidentRepository,
    private readonly httpCrud: HttpCrudService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Forwards a batch of incidents to the external OpsMonitor Incidents API
   * (`API_OPSMONITOR_INCIDENTS` + `/incidents`) using the shared axios client.
   */
  async record(dtos: CreateIncidentDto[]): Promise<unknown> {
    const baseUrl = this.config.get<string>('API_OPSMONITOR_INCIDENTS');
    const url = `${baseUrl!.replace(/\/+$/, '')}/incidents`;

    return this.httpCrud.create(url, dtos);
  }

  async update(id: string, dto: UpdateIncidentDto): Promise<Incident> {
    const updated = await this.incidentRepository.updateIncident(id, dto);
    if (!updated) {
      throw new NotFoundException(`Incident ${id} not found`);
    }

    return updated;
  }

  /** Updates several incidents in a single operation. */
  updateMany(dto: BulkUpdateIncidentsDto): Promise<Incident[]> {
    return Promise.all(
      dto.items.map(({ id, ...changes }) => this.update(id, changes)),
    );
  }

  async getById(id: string): Promise<Incident> {
    const incident = await this.incidentRepository.findById(id);
    if (!incident) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
    return incident;
  }

  /** Lists incidents, optionally filtered by status, severity, app or assignee. */
  list(query: QueryIncidentDto = {}): Promise<Incident[]> {
    const hasFilters = Object.values(query).some((v) => v !== undefined);
    return hasFilters
      ? this.incidentRepository.search(query)
      : this.incidentRepository.findAll();
  }

  async remove(id: string): Promise<void> {
    const removed = await this.incidentRepository.remove(id);
    if (!removed) {
      throw new NotFoundException(`Incident ${id} not found`);
    }
  }
}
