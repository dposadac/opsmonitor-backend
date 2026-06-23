import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AlertsModule } from './alerts.module';

async function bootstrap() {
  const app = await NestFactory.create(AlertsModule);
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Alerts API')
    .setDescription('Envío y seguimiento de alertas (bounded context: alerts)')
    .setVersion('1.0')
    .addTag('alerts')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('ALERTS_PORT', 3003);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[alerts] listening on http://localhost:${port}/api`);
  // eslint-disable-next-line no-console
  console.log(`[alerts] swagger on http://localhost:${port}/docs`);
}
bootstrap();
