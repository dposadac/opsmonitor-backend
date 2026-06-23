/**
 * Value object encapsulating the allowed severities for an event.
 */
export const EVENT_STATUS = ['pending', 'open', 'in_progress', 'resolved'] as const;

export type EventStatusValue = (typeof EVENT_STATUS)[number];

export class EventStatus {
  private constructor(public readonly value: EventStatusValue) {}

  static of(value: string): EventStatus {
    if (!EVENT_STATUS.includes(value as EventStatusValue)) {
      throw new Error(`Invalid event severity: ${value}`);
    }
    return new EventStatus(value as EventStatusValue);
  }
}
