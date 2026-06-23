import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  EVENT_INCIDENT_QUEUE,
  EventIncidentJobPayload,
} from '@app/repository';
import { AlertsService } from '../application/alerts.service';

/**
 * Consumer BullMQ de la cola `event-incident-queue`. Por cada job recibido
 * genera y persiste una alerta en MongoDB.
 */
@Processor(EVENT_INCIDENT_QUEUE)
export class AlertProcessor extends WorkerHost {
  private readonly logger = new Logger(AlertProcessor.name);

  constructor(private readonly alertsService: AlertsService) {
    super();
  }

  async process(job: Job<EventIncidentJobPayload>): Promise<void> {
    const alert = await this.alertsService.createFromEvent(job.data);
    this.logger.log(
      `Alerta ${alert.id} generada desde evento ${job.data.eventId} (job ${job.id})`,
    );
  }
}
