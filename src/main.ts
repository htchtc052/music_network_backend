import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import * as process from 'process';

async function bootstrap() {
  let app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('MyMusic App API').build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new I18nValidationPipe());

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorFormatter: (errors) => {
        //console.debug(errors);
        const errorMessages = {};
        errors.forEach((error) => {
          errorMessages[`${error.property}`] = Object.values(
            error.constraints,
          )[0];
        });

        return errorMessages;
      },
    }),
  );

  app.enableCors({
    // true for all origins
    origin: '*',
  });
  //

  await app.listen(process.env.API_PORT);

  console.info(`API started on port ${process.env.API_PORT}`);
}

bootstrap();
