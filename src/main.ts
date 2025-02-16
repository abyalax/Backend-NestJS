import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolve } from 'path';
import * as cookieParser from 'cookie-parser';
import * as mustache from 'mustache-express';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.use(cookieParser(configService.get('COOKIE_SECRET')));

  app.set('views', resolve(__dirname, '..', '..', 'views'));
  app.set('view engine', 'html');
  app.engine('html', mustache());
  app.enableShutdownHooks()
  await app.listen(configService.get('PORT') ?? 3000)
    .then(() => console.log('application listening on port ' + (configService.get('PORT') ?? 3000)))
    .catch((e) => console.log(e));
}
void bootstrap();
