import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IncidentDocument = HydratedDocument<IncidentSchemaClass>;

/**
 * Persistence model for the Incidents bounded context (MongoDB via Mongoose).
 */
@Schema({ collection: 'incidents', timestamps: true })
export class IncidentSchemaClass {
  @Prop({ required: true, index: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, enum: ['open', 'investigating', 'resolved'], default: 'open', index: true })
  status: string;

  @Prop({ required: true, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  priority: string;

  @Prop({ type: [String], default: [] })
  relatedEventIds: string[];

  @Prop()
  resolvedAt?: Date;
}

export const IncidentSchema = SchemaFactory.createForClass(IncidentSchemaClass);
export const INCIDENT_MODEL_NAME = IncidentSchemaClass.name;
