import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as compress from 'compression';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Inject ConfigService
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 3000;

  app.use(compress());
  app.use(morgan('dev'));
  app.disable('x-powered-by');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(PORT);
}
bootstrap();
