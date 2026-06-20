import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Alert, AlertChannel } from '../domain/alert.entity';
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

  async dispatch(input: {
    incidentId: string;
    channel: string;
    message: string;
  }): Promise<Alert> {
    const alert = new Alert({
      incidentId: input.incidentId,
      channel: input.channel as AlertChannel,
      message: input.message,
    });
    // Persist as pending, then simulate the send and update status.
    const saved = await this.alertRepository.save(alert);
    saved.markSent();
    return (await this.alertRepository.update(saved.id as string, saved)) ?? saved;
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

  async acknowledge(id: string): Promise<Alert> {
    const alert = await this.getById(id);
    alert.acknowledge();
    const updated = await this.alertRepository.update(id, alert);
    if (!updated) {
      throw new NotFoundException(`Alert ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.alertRepository.remove(id);
    if (!removed) {
      throw new NotFoundException(`Alert ${id} not found`);
    }
  }
}
