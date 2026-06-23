export type AlertProcessingStatus = 'pending' | 'in_progress' | 'completed';

export const ALERT_PROCESSING_STATUSES: AlertProcessingStatus[] = [
  'pending',
  'in_progress',
  'completed',
];

export interface AlertProps {
  id?: string;
  originEvent: string;
  affectedApplication: string;
  severity: string;
  generatedAt?: Date;
  processingStatus?: AlertProcessingStatus;
}

/**
 * Alert aggregate root for the Alerts bounded context.
 * Una alerta se genera a partir de un evento consumido desde la cola
 * `event-incident-queue`. La fecha de generación se asigna al crearse y el
 * estado de procesamiento arranca en `pending`.
 */
export class Alert {
  readonly id?: string;
  readonly originEvent: string;
  readonly affectedApplication: string;
  readonly severity: string;
  readonly generatedAt: Date;
  processingStatus: AlertProcessingStatus;

  constructor(props: AlertProps) {
    if (!props.originEvent) throw new Error('Alert.originEvent is required');
    if (!props.affectedApplication)
      throw new Error('Alert.affectedApplication is required');
    if (!props.severity) throw new Error('Alert.severity is required');

    this.id = props.id;
    this.originEvent = props.originEvent;
    this.affectedApplication = props.affectedApplication;
    this.severity = props.severity;
    this.generatedAt = props.generatedAt ?? new Date();
    this.processingStatus = props.processingStatus ?? 'pending';
  }

  /** Domain behavior: marca la alerta como en proceso. */
  markInProgress(): void {
    this.processingStatus = 'in_progress';
  }

  /** Domain behavior: marca la alerta como completada. */
  markCompleted(): void {
    this.processingStatus = 'completed';
  }
}
