import { IncidentDocument } from '@app/repository';
import { Incident, IncidentPriority, IncidentStatus } from '../domain/incident.entity';

/**
 * Translates between the Incident aggregate and the Mongoose document.
 */
export class IncidentMapper {
  static toDomain(doc: IncidentDocument | Record<string, any>): Incident {
    return new Incident({
      id: doc._id?.toString(),
      title: doc.title,
      description: doc.description,
      status: doc.status as IncidentStatus,
      priority: doc.priority as IncidentPriority,
      relatedEventIds: doc.relatedEventIds ?? [],
      resolvedAt: doc.resolvedAt,
    });
  }

  static toPersistence(incident: Incident): Record<string, unknown> {
    return {
      title: incident.title,
      description: incident.description,
      status: incident.status,
      priority: incident.priority,
      relatedEventIds: incident.relatedEventIds,
      resolvedAt: incident.resolvedAt,
    };
  }
}
