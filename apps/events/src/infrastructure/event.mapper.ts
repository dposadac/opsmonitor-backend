import { EventDocument } from "@app/repository/entities/mongoose/event.schema";
import { EventMonitor } from "../domain/event.entity";

/**
 * Translates between the Incident aggregate and the Mongoose document.
 */
export class EventMapper {
  static toDomain(doc: EventDocument | Record<string, any>): EventMonitor {
    return new EventMonitor({
      id: doc._id?.toString(),
      description: doc.description,
      eventType: doc.eventType,
      severity: doc.severity,
      traceId: doc.traceId,
      originApplication: doc.originApplication,
      occurredAt: doc.occurredDateAt
    });
  }

  static toPersistence(event: Partial<EventMonitor>): Record<string, unknown> {
    const doc: Record<string, unknown> = {};
    if (event.description !== undefined) doc.description = event.description;
    if (event.eventType !== undefined) doc.eventType = event.eventType;
    if (event.severity !== undefined) doc.severity = event.severity.value;
    if (event.traceId !== undefined) doc.traceId = event.traceId;
    if (event.occurredAt !== undefined) doc.occurredDateAt = event.occurredAt;
    if (event.originApplication !== undefined) doc.originApplication = event.originApplication;
    return doc;
  }
}