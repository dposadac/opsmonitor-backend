import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EVENT_MODEL_NAME,
  EventSchema,
  RepositoryModule,
} from '@app/repository';
import { SharedModule } from '@app/shared';
import { IncidentsService } from './application/incidents.service';
import { INCIDENT_REPOSITORY } from './domain/incident.repository';
import { IncidentRepositoryImpl } from './infrastructure/incident.repository.impl';
import { IncidentsController } from './presentation/incidents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsOrmEntity } from '@app/repository/entities/typeorm/incident-entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RepositoryModule.forPostgres(),
    TypeOrmModule.forFeature([IncidentsOrmEntity]),
    SharedModule,
  ],
  controllers: [IncidentsController],
  providers: [
    IncidentsService,
    { provide: INCIDENT_REPOSITORY, useClass: IncidentRepositoryImpl },
  ],
})
export class IncidentsModule {}
