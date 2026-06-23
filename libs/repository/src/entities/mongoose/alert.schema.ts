import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AlertDocument = HydratedDocument<AlertSchemaClass>;

/** Estados de procesamiento de una alerta. */
export const ALERT_PROCESSING_STATUS = ['pending', 'in_progress', 'completed'] as const;

/**
 * Persistence model for the Alerts bounded context (MongoDB via Mongoose).
 * Una alerta se genera a partir de un evento consumido desde la cola
 * `event-incident-queue`.
 */
@Schema({ collection: 'alerts', timestamps: true })
export class AlertSchemaClass {
  /** Evento origen que disparó la alerta. */
  @Prop({ required: true }) originEvent!: string;

  /** Aplicación afectada. */
  @Prop({ required: true }) affectedApplication!: string;

  /** Severidad heredada del evento. */
  @Prop({ required: true, enum: ['low', 'medium', 'high', 'critical'] }) severity!: string;

  /** Fecha de generación: se asigna automáticamente al insertar. */
  @Prop({ default: () => new Date() }) generatedAt!: Date;

  /** Estado de procesamiento, por defecto `pending`. */
  @Prop({ enum: ALERT_PROCESSING_STATUS, default: 'pending' }) processingStatus!: string;
}

export const AlertSchema = SchemaFactory.createForClass(AlertSchemaClass);
AlertSchema.index({ affectedApplication: 1, severity: 1, generatedAt: -1 });
export const ALERT_MODEL_NAME = AlertSchemaClass.name;
