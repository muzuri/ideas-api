import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const port = process.env.PORT || 8000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:  [
      'http://localhost:4200', // reactive
      'http://localhost:3000', // react
      'http:/localhost:8081', // react-native
    ],
  });
  await app.listen(port);
  Logger.log(`server running on port http://localhost:${port}`, 'Boostrap');
}
bootstrap();
