import { EventSeverity } from './value-objects/event-severity.vo';

export interface EventProps {
  id?: string;
  source: string;
  type: string;
  severity: string;
  payload?: Record<string, unknown>;
  occurredAt?: Date;
}

/**
 * Event aggregate root — the domain model for the Events bounded context.
 * Independent from any persistence concern.
 */
export class Event {
  readonly id?: string;
  readonly source: string;
  readonly type: string;
  readonly severity: EventSeverity;
  readonly payload: Record<string, unknown>;
  readonly occurredAt: Date;

  constructor(props: EventProps) {
    if (!props.source) throw new Error('Event.source is required');
    if (!props.type) throw new Error('Event.type is required');

    this.id = props.id;
    this.source = props.source;
    this.type = props.type;
    this.severity = EventSeverity.of(props.severity);
    this.payload = props.payload ?? {};
    this.occurredAt = props.occurredAt ?? new Date();
  }

  /** Business rule example: should this event escalate into an incident? */
  shouldEscalate(): boolean {
    return this.severity.isCritical();
  }
}
