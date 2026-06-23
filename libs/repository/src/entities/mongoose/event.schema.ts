import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<EventSchemaClass>;

/**
 * Persistence model for the Incidents bounded context (MongoDB via Mongoose).
 */
@Schema({ collection: 'events', timestamps: true })
export class EventSchemaClass {
  @Prop({ required: true }) traceId?: string;
  @Prop({ required: true }) originApplication?: string;
  @Prop({ required: true }) eventType?: string;
  @Prop() description?: string;
  @Prop({ required: true, enum: ['low', 'medium', 'high', 'critical'] }) severity?: string;
  @Prop() occurredDateAt?: Date;
  @Prop() updateAt?: string;
  @Prop({ type: Object, default: {} }) metadata?: Record<string, unknown>;
}

export const EventSchema = SchemaFactory.createForClass(EventSchemaClass);
EventSchema.index({ originApplication: 1, severity: 1, occurredDateAt: -1 });
export const EVENT_MODEL_NAME = EventSchemaClass.name;
