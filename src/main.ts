import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(graphqlUploadExpress());

  await app.listen(3000);
}
bootstrap();
