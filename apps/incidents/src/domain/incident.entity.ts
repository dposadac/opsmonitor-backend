import { IncidentSeverity } from "./value-objects/incident-severity.vo";
import { IncidentStatus } from "./value-objects/incident-status.vo";

export interface IncidentProps {
  id?: string;
  title?: string;
  description?: string;
  affected_app?: string;
  status: string;
  severity: string;
  assignee?: string;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Incident aggregate root for the Incidents bounded context.
 */
export class Incident {
  readonly id?: string;
  title?: string;
  description?: string;
  affected_app?: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  assignee?: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(props: IncidentProps) {
    if (!props.title) throw new Error('Incident.title is required');
    this.id = props.id;
    this.title = props.title;
    this.affected_app = props.affected_app;
    this.description = props.description;
    this.status = IncidentStatus.of(props.status);
    this.severity = IncidentSeverity.of(props.severity);
    this.assignee = props.assignee;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
