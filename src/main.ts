import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    SwaggerModule.setup('/docs', app, SwaggerModule.createDocument(app, new DocumentBuilder()
        .setTitle('MyBlog')
        .addBearerAuth()
        .build()
    ));

    await app.listen(+process.env.API_HTTP_PORT);
}
bootstrap();
