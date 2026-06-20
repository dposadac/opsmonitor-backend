export type IncidentStatus = 'open' | 'investigating' | 'resolved';
export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical';

export interface IncidentProps {
  id?: string;
  title: string;
  description?: string;
  status?: IncidentStatus;
  priority?: IncidentPriority;
  relatedEventIds?: string[];
  resolvedAt?: Date;
}

/**
 * Incident aggregate root for the Incidents bounded context.
 */
export class Incident {
  readonly id?: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  relatedEventIds: string[];
  resolvedAt?: Date;

  constructor(props: IncidentProps) {
    if (!props.title) throw new Error('Incident.title is required');
    this.id = props.id;
    this.title = props.title;
    this.description = props.description ?? '';
    this.status = props.status ?? 'open';
    this.priority = props.priority ?? 'medium';
    this.relatedEventIds = props.relatedEventIds ?? [];
    this.resolvedAt = props.resolvedAt;
  }

  /** Domain behavior: transition the incident to resolved. */
  resolve(): void {
    if (this.status === 'resolved') {
      throw new Error('Incident is already resolved');
    }
    this.status = 'resolved';
    this.resolvedAt = new Date();
  }
}
