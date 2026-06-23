import { Connection } from 'mongoose';
import { EventSchema, EVENT_MODEL_NAME, EventSchemaClass } from '../entities/mongoose/event.schema';
import { EventSeverity } from 'apps/events/src/domain/value-objects/event-severity.vo';

/**
 * Initial data population / test fixtures for the events collection (MongoDB via Mongoose).
 */
export async function seedEvents(connection: Connection): Promise<void> {
  
  const model = connection.models[EVENT_MODEL_NAME]
    ?? connection.model<EventSchemaClass>(EVENT_MODEL_NAME, EventSchema);

  const count = await model.countDocuments();
  if (count > 0) {
    return;
  }

  await model.create([
    {
      traceId: 'trace-0001',
      originApplication: 'App1',
      eventType: 'test',
      description: 'test1',
      severity: EventSeverity.of('critical').value,
      occurredDateAt: new Date(),
      metadata: {}
    }
  ]);
}
