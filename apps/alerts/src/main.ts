import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AlertsModule } from './alerts.module';

async function bootstrap() {
  const app = await NestFactory.create(AlertsModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);
  const port = config.get<number>('ALERTS_PORT', 3003);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[alerts] listening on http://localhost:${port}/api`);
}
bootstrap();
