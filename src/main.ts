import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compress from 'compression';
import * as morgan from 'morgan';
// import * as csurf from 'csurf';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 3000;

  // Security Middlewares
  app.enableCors({ allowedHeaders: '*' });
  app.use(helmet());
  // app.use(csurf());
  app.disable('x-powered-by');

  app.use(compress());
  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  await app.listen(PORT);
}
bootstrap();
