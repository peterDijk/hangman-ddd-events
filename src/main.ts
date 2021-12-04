import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  // ClassSerializerInterceptor,
  Logger,
  // ValidationPipe,
} from '@nestjs/common';

import { AppModule } from './modules/app.module';
import { config } from '../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.PREFIX);
  // app.useGlobalFilters(new AllExceptionsFilter());
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // app.useGlobalPipes(new ValidationPipe());
  // Swagger.io setup
  app.enableCors();
  const documentOptions = new DocumentBuilder()
    .setTitle(config.TITLE)
    .setDescription(config.DESCRIPTION)
    .setVersion(config.VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup(config.API_EXPLORER_PATH, app, document);

  await app.listen(config.PORT, config.HOST);
  Logger.log(`Server listening on port ${config.EXT_PORT}`, 'Bootstrap');
  Logger.log(
    `API Explorer available on port ${config.EXT_PORT}${config.API_EXPLORER_PATH}`,
  );
}
bootstrap();
