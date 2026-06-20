export type AlertChannel = 'email' | 'sms' | 'slack' | 'webhook';
export type AlertStatus = 'pending' | 'sent' | 'acknowledged' | 'failed';

export interface AlertProps {
  id?: string;
  incidentId: string;
  channel: AlertChannel;
  message: string;
  status?: AlertStatus;
  createdAt?: Date;
  sentAt?: Date;
}

/**
 * Alert aggregate root for the Alerts bounded context.
 */
export class Alert {
  readonly id?: string;
  readonly incidentId: string;
  readonly channel: AlertChannel;
  readonly message: string;
  status: AlertStatus;
  readonly createdAt: Date;
  sentAt?: Date;

  constructor(props: AlertProps) {
    if (!props.incidentId) throw new Error('Alert.incidentId is required');
    if (!props.message) throw new Error('Alert.message is required');
    this.id = props.id;
    this.incidentId = props.incidentId;
    this.channel = props.channel;
    this.message = props.message;
    this.status = props.status ?? 'pending';
    this.createdAt = props.createdAt ?? new Date();
    this.sentAt = props.sentAt;
  }

  /** Domain behavior: mark the alert as dispatched. */
  markSent(): void {
    this.status = 'sent';
    this.sentAt = new Date();
  }

  acknowledge(): void {
    if (this.status !== 'sent') {
      throw new Error('Only sent alerts can be acknowledged');
    }
    this.status = 'acknowledged';
  }
}
