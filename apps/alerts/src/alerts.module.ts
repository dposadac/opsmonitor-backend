import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ALERT_MODEL_NAME,
  AlertSchema,
  EVENT_INCIDENT_QUEUE,
  RepositoryModule,
} from '@app/repository';
import { AlertsService } from './application/alerts.service';
import { ALERT_REPOSITORY } from './domain/alert.repository';
import { AlertRepositoryImpl } from './infrastructure/alert.repository.impl';
import { AlertProcessor } from './infrastructure/alert.processor';
import { AlertsController } from './presentation/alerts.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RepositoryModule.forMongo(),
    RepositoryModule.forBullmq(),
    MongooseModule.forFeature([
      { name: ALERT_MODEL_NAME, schema: AlertSchema },
    ]),
    BullModule.registerQueue({ name: EVENT_INCIDENT_QUEUE }),
  ],
  controllers: [AlertsController],
  providers: [
    AlertsService,
    AlertProcessor,
    { provide: ALERT_REPOSITORY, useClass: AlertRepositoryImpl },
  ],
})
export class AlertsModule {}
