/**
 * Contrato compartido de la cola BullMQ entre la app de Events (producer)
 * y la app de Alerts (consumer).
 */

/** Nombre de la cola BullMQ. */
export const EVENT_INCIDENT_QUEUE = 'event-incident-queue';

/** Nombre del job encolado en `event-incident-queue`. */
export const EVENT_INCIDENT_JOB = 'event-incident';

/**
 * Payload publicado por la app de Events y consumido por la app de Alerts.
 */
export interface EventIncidentJobPayload {
  /** Id del evento origen. */
  eventId: string;
  /** Aplicación afectada. */
  affectedApplication: string;
  /** Severidad del evento. */
  severity: string;
}
