/**
 * Value object encapsulating the traceability ID for an event.
 * Generates consecutive identifiers in the form EVENT-0001, EVENT-0002, etc.
 */
export const EVENT_TRACE_PREFIX = 'EVENT';
export const EVENT_TRACE_PADDING = 4;

export class EventTraceId {
  private static counter = 0;

  private constructor(public readonly value: string) {}

  /**
   * Generates the next consecutive trace ID (e.g. EVENT-0001).
   */
  static next(): EventTraceId {
    EventTraceId.counter += 1;
    const sequence = String(EventTraceId.counter).padStart(EVENT_TRACE_PADDING, '0');
    return new EventTraceId(`${EVENT_TRACE_PREFIX}-${sequence}`);
  }

  /**
   * Rebuilds a trace ID from an existing value.
   */
  static of(value: string): EventTraceId {
    const pattern = new RegExp(String.raw`^${EVENT_TRACE_PREFIX}-\d{${EVENT_TRACE_PADDING},}$`);
    if (!pattern.test(value)) {
      throw new Error(`Invalid event trace ID: ${value}`);
    }
    return new EventTraceId(value);
  }
}
