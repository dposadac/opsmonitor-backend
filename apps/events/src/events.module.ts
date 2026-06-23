import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  EVENT_INCIDENT_QUEUE,
  EVENT_MODEL_NAME,
  EventSchema,
  RepositoryModule,
} from '@app/repository';
import { EventsService } from './application/events.service';
import { EVENT_REPOSITORY } from './domain/event.repository';
import { EventRepositoryImpl } from './infrastructure/event.repository.impl';
import { EventsController } from './presentation/events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RepositoryModule.forRedis(),
    RepositoryModule.forMongo(),
    RepositoryModule.forBullmq(),
    MongooseModule.forFeature([
      { name: EVENT_MODEL_NAME, schema: EventSchema },
    ]),
    BullModule.registerQueue({ name: EVENT_INCIDENT_QUEUE }),
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    { provide: EVENT_REPOSITORY, useClass: EventRepositoryImpl },
  ],
})
export class EventsModule {}
