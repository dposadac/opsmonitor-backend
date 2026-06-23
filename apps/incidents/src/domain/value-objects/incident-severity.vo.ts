/**
 * Value object encapsulating the allowed severities for an event.
 */
export const INCIDENT_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;

export type IncidentSeverityValue = (typeof INCIDENT_SEVERITIES)[number];

export class IncidentSeverity {
  private constructor(public readonly value: IncidentSeverityValue) {}

  static of(value: string): IncidentSeverity {
    if (!INCIDENT_SEVERITIES.includes(value as IncidentSeverityValue)) {
      throw new Error(`Invalid Incident severity: ${value}`);
    }
    return new IncidentSeverity(value as IncidentSeverityValue);
  }

  isCritical(): boolean {
    return this.value === 'critical';
  }
}