import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IncidentsModule } from './incidents.module';

async function bootstrap() {
  const app = await NestFactory.create(IncidentsModule);
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Incidents API')
    .setDescription('Gestión de incidentes (bounded context: incidents)')
    .setVersion('1.0')
    .addTag('incidents')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('INCIDENTS_PORT', 3002);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[incidents] listening on http://localhost:${port}/api`);
  // eslint-disable-next-line no-console
  console.log(`[incidents] swagger on http://localhost:${port}/docs`);
}
bootstrap();
