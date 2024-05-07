import { NestFactory } from '@nestjs/core';
import * as mongoose from 'mongoose';
import { MainModule } from './client/main.module';

async function bootstrap() {
  mongoose.set('debug', true);
  const app = await NestFactory.create(MainModule);
  await app.listen(3000);
}
bootstrap();
