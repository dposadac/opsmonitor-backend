import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventIncidentJobPayload } from '@app/repository';
import { Alert } from '../domain/alert.entity';
import { ALERT_REPOSITORY, IAlertRepository } from '../domain/alert.repository';

/**
 * Application service / use cases for the Alerts bounded context.
 */
@Injectable()
export class AlertsService {
  constructor(
    @Inject(ALERT_REPOSITORY)
    private readonly alertRepository: IAlertRepository,
  ) {}

  /**
   * Crea y persiste una alerta a partir del payload consumido desde la cola
   * `event-incident-queue`. La fecha de generación y el estado `pending` los
   * asigna el agregado de dominio.
   */
  async createFromEvent(payload: EventIncidentJobPayload): Promise<Alert> {
    const alert = new Alert({
      originEvent: payload.eventId,
      affectedApplication: payload.affectedApplication,
      severity: payload.severity,
    });
    return this.alertRepository.save(alert);
  }

  async getById(id: string): Promise<Alert> {
    const alert = await this.alertRepository.findById(id);
    if (!alert) {
      throw new NotFoundException(`Alert ${id} not found`);
    }
    return alert;
  }

  list(): Promise<Alert[]> {
    return this.alertRepository.findAll();
  }

  async remove(id: string): Promise<void> {
    const removed = await this.alertRepository.remove(id);
    if (!removed) {
      throw new NotFoundException(`Alert ${id} not found`);
    }
  }
}
