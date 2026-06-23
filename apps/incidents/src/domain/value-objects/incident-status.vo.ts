/**
 * Value object encapsulating the allowed statuses for an incident.
 */
export const INCIDENT_STATUS = ['open', 'in_progress', 'pending', 'resolved'] as const;

export type IncidentStatusValue = (typeof INCIDENT_STATUS)[number];

export class IncidentStatus {
  private constructor(public readonly value: IncidentStatusValue) {}

  static of(value: string): IncidentStatus {
    if (!INCIDENT_STATUS.includes(value as IncidentStatusValue)) {
      throw new Error(`Invalid Incident status: ${value}`);
    }
    return new IncidentStatus(value as IncidentStatusValue);
  }
}