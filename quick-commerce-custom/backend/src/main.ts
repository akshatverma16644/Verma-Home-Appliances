import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  const port = process.env.PORT || 4000;
  await app.listen(port as number);
  console.log(`API listening on http://localhost:${port}`);
}
bootstrap();
