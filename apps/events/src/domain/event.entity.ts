import { EventSeverity } from './value-objects/event-severity.vo';
import { EventTraceId } from './value-objects/event-traceid.vo';

export interface EventProps {
  id?: string;
  originApplication:string;
  eventType: string;
  description: string;
  severity: string;
  traceId?: string;
  occurredAt?: string;
}

/**
 * Event aggregate root — the domain model for the Events bounded context.
 * Independent from any persistence concern.
 */
export class EventMonitor {
  readonly id?: string;
  eventType: string;
  originApplication:string;
  description: string;
  severity: EventSeverity;
  traceId: string;
  occurredAt?: string;

  constructor(props: EventProps) {
    if (!props.eventType) throw new Error('Event.source is required');
    if (!props.severity) throw new Error('Event.type is required');

    this.id = props.id;
    this.eventType = props.eventType;
    this.originApplication = props.originApplication;
    this.description = props.description;
    this.severity = EventSeverity.of(props.severity);
    this.traceId = props.traceId ? EventTraceId.of(props.traceId).value : EventTraceId.next().value;
    this.occurredAt = props.occurredAt;
  }
}
