import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RepositoryModule } from '@app/repository';
import { AlertsService } from './application/alerts.service';
import { ALERT_REPOSITORY } from './domain/alert.repository';
import { AlertRepositoryImpl } from './infrastructure/alert.repository.impl';
import { AlertsController } from './presentation/alerts.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RepositoryModule.forRedis(),
  ],
  controllers: [AlertsController],
  providers: [
    AlertsService,
    { provide: ALERT_REPOSITORY, useClass: AlertRepositoryImpl },
  ],
})
export class AlertsModule {}
