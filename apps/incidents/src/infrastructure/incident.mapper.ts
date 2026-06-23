import { IncidentsOrmEntity } from "@app/repository/entities/typeorm/incident-entity";
import { Incident } from "../domain/incident.entity";

/**
 * Translates between the domain aggregate and the TypeORM persistence model.
 */
export class IncidentMapper {
  static toDomain(orm: IncidentsOrmEntity): Incident {
    return new Incident({
        id: orm.id,
        severity: orm.severity,
        affected_app: orm.affected_app,
        assignee: orm.assignee,
        created_at: orm.created_at,
        updated_at: orm.updated_at,
        description: orm.description,
        status: orm.status_incident,
        title: orm.title
    });
  }

  /**
   * Builds a persistence payload. Only the fields present in the (possibly
   * partial) domain object are included, so it is safe for partial updates.
   */
  static toPersistence(incident: Partial<Incident>): Partial<IncidentsOrmEntity> {
    const orm: Partial<IncidentsOrmEntity> = {};
    if (incident.id !== undefined) orm.id = incident.id;
    if (incident.title !== undefined) orm.title = incident.title;
    if (incident.description !== undefined) orm.description = incident.description;
    if (incident.affected_app !== undefined) orm.affected_app = incident.affected_app;
    if (incident.assignee !== undefined) orm.assignee = incident.assignee;
    if (incident.severity !== undefined) orm.severity = incident.severity.value;
    if (incident.status !== undefined) orm.status_incident = incident.status.value;
    if (incident.created_at !== undefined) orm.created_at = incident.created_at;
    if (incident.updated_at !== undefined) orm.updated_at = incident.updated_at;
    return orm;
  }
}