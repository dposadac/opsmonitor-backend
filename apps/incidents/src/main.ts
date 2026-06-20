import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IncidentsModule } from './incidents.module';

async function bootstrap() {
  const app = await NestFactory.create(IncidentsModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);
  const port = config.get<number>('INCIDENTS_PORT', 3002);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[incidents] listening on http://localhost:${port}/api`);
}
bootstrap();
