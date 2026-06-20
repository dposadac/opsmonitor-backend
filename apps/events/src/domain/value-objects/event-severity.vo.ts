/**
 * Value object encapsulating the allowed severities for an event.
 */
export const EVENT_SEVERITIES = ['info', 'warning', 'error', 'critical'] as const;

export type EventSeverityValue = (typeof EVENT_SEVERITIES)[number];

export class EventSeverity {
  private constructor(public readonly value: EventSeverityValue) {}

  static of(value: string): EventSeverity {
    if (!EVENT_SEVERITIES.includes(value as EventSeverityValue)) {
      throw new Error(`Invalid event severity: ${value}`);
    }
    return new EventSeverity(value as EventSeverityValue);
  }

  isCritical(): boolean {
    return this.value === 'critical' || this.value === 'error';
  }
}
