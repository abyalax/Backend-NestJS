import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalExceptionFilter } from './common/http-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as mustache from 'mustache-express'
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  const configService = app.get(ConfigService);
  app.use(cookieParser(configService.get('COOKIE_SECRET')));
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'html');
  app.engine('html', mustache());
  await app.listen(configService.get('PORT') ?? 3000).then(() => {
    console.log(`Application is running on: http://localhost:${configService.get('PORT')}`);
  }).catch((error) => {
    console.error(error);
  })
}
void bootstrap();
