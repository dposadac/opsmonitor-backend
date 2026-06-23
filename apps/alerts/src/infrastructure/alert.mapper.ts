import { AlertDocument } from '@app/repository';
import { Alert, AlertProcessingStatus } from '../domain/alert.entity';

/**
 * Translates between the Alert aggregate and the Mongoose document.
 */
export class AlertMapper {
  static toDomain(doc: AlertDocument | Record<string, any>): Alert {
    return new Alert({
      id: doc._id?.toString(),
      originEvent: doc.originEvent,
      affectedApplication: doc.affectedApplication,
      severity: doc.severity,
      generatedAt: doc.generatedAt,
      processingStatus: doc.processingStatus as AlertProcessingStatus,
    });
  }

  static toPersistence(alert: Partial<Alert>): Record<string, unknown> {
    const doc: Record<string, unknown> = {};
    if (alert.originEvent !== undefined) doc.originEvent = alert.originEvent;
    if (alert.affectedApplication !== undefined)
      doc.affectedApplication = alert.affectedApplication;
    if (alert.severity !== undefined) doc.severity = alert.severity;
    if (alert.generatedAt !== undefined) doc.generatedAt = alert.generatedAt;
    if (alert.processingStatus !== undefined)
      doc.processingStatus = alert.processingStatus;
    return doc;
  }
}
