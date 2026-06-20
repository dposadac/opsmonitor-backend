import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  INCIDENT_MODEL_NAME,
  IncidentSchema,
  RepositoryModule,
} from '@app/repository';
import { IncidentsService } from './application/incidents.service';
import { INCIDENT_REPOSITORY } from './domain/incident.repository';
import { IncidentRepositoryImpl } from './infrastructure/incident.repository.impl';
import { IncidentsController } from './presentation/incidents.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RepositoryModule.forMongo(),
    MongooseModule.forFeature([
      { name: INCIDENT_MODEL_NAME, schema: IncidentSchema },
    ]),
  ],
  controllers: [IncidentsController],
  providers: [
    IncidentsService,
    { provide: INCIDENT_REPOSITORY, useClass: IncidentRepositoryImpl },
  ],
})
export class IncidentsModule {}
