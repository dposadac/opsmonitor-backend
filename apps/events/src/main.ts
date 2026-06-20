import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { EventsModule } from './events.module';

async function bootstrap() {
  const app = await NestFactory.create(EventsModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);
  const port = config.get<number>('EVENTS_PORT', 3001);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[events] listening on http://localhost:${port}/api`);
}
bootstrap();
