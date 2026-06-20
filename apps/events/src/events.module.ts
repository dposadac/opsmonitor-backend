import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventOrmEntity, RepositoryModule } from '@app/repository';
import { EventsService } from './application/events.service';
import { EVENT_REPOSITORY } from './domain/event.repository';
import { EventRepositoryImpl } from './infrastructure/event.repository.impl';
import { EventsController } from './presentation/events.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RepositoryModule.forPostgres(),
    RepositoryModule.forRedis(),
    TypeOrmModule.forFeature([EventOrmEntity]),
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    { provide: EVENT_REPOSITORY, useClass: EventRepositoryImpl },
  ],
})
export class EventsModule {}
