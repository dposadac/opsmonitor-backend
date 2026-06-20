import { Incident } from './incident.entity';

/** DI token for the Incidents repository port. */
export const INCIDENT_REPOSITORY = Symbol('INCIDENT_REPOSITORY');

/**
 * Custom repository port for the Incidents aggregate.
 */
export interface IIncidentRepository {
  save(incident: Incident): Promise<Incident>;
  findById(id: string): Promise<Incident | null>;
  findByStatus(status: string): Promise<Incident[]>;
  findAll(): Promise<Incident[]>;
  update(id: string, incident: Incident): Promise<Incident | null>;
  remove(id: string): Promise<boolean>;
}
