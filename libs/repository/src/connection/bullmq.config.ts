import { ConfigService } from '@nestjs/config';
import { SharedBullConfigurationFactory } from '@nestjs/bullmq';
import { QueueOptions } from 'bullmq';

/**
 * Configuración centralizada de la conexión BullMQ (reusa el Redis compartido).
 */
export function bullmqModuleFactory(config: ConfigService): QueueOptions {
  return {
    connection: {
      host: config.get<string>('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
      password: config.get<string>('REDIS_PASSWORD') || undefined,
      db: config.get<number>('REDIS_DB', 0),
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
  };
}

/** Variante basada en clase, por si se prefiere `BullModule.forRootAsync({ useClass })`. */
export class BullmqConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly config: ConfigService) {}

  createSharedConfiguration(): QueueOptions {
    return bullmqModuleFactory(this.config);
  }
}
