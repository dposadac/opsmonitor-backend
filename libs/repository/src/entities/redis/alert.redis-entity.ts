/**
 * Persistence model for the Alerts bounded context (Redis).
 * Stored as JSON under `alert:<id>`.
 */
export interface AlertRedisEntity {
  id: string;
  incidentId: string;
  channel: 'email' | 'sms' | 'slack' | 'webhook';
  message: string;
  status: 'pending' | 'sent' | 'acknowledged' | 'failed';
  createdAt: string;
  sentAt?: string;
}

export const ALERT_NAMESPACE = 'alert';
