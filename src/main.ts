import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compress from 'compression';
import * as morgan from 'morgan';
// import * as csurf from 'csurf';

import { AppModule } from './app.module';
import { SocketIOAdapter } from './config/socket-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 3000;

  // OpenApi - Swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Fleet')
    .setDescription('API Documentation for Fleet')
    .setVersion('1.0')
    .setLicense('MIT', '')
    .addServer(`http://localhost:${PORT}/api/v1/`, 'Local environment')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    // .addServer('https://staging.yourapi.com/', 'Staging')
    // .addServer('https://production.yourapi.com/', 'Production')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('docs', app, document);

  // Security Middlewares
  app.enableCors({
    origin: true,
    methods: ['GET', 'OPTIONS'],
    credentials: true,
  });
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  app.use(helmet());
  app.disable('x-powered-by');
  // app.use(csurf());

  app.use(compress());
  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  await app.listen(PORT);
}
bootstrap();
