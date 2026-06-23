import { UpdateIncidentDto } from '../presentation/dto/update-incident.dto';
import { Incident } from './incident.entity';

/** DI token for the Incidents repository port. */
export const INCIDENT_REPOSITORY = Symbol('INCIDENT_REPOSITORY');

/** Optional filters supported when searching incidents. */
export interface IncidentFilters {
  status?: string;
  severity?: string;
  affected_app?: string;
  assignee?: string;
}

/**
 * Custom repository port for the Incidents aggregate.
 */
export interface IIncidentRepository {
  save(incident: Incident): Promise<Incident>;
  findById(id: string): Promise<Incident | null>;
  search(filters: IncidentFilters): Promise<Incident[]>;
  findAll(): Promise<Incident[]>;
  updateIncident(id: string, incident: UpdateIncidentDto): Promise<Incident | null>;
  remove(id: string): Promise<boolean>;
}
