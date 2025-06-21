import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public')); //js css, images, etc.
  app.setBaseViewsDir(join(__dirname, '..', 'view')); //view
  app.setViewEngine('ejs');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ properties không có decorator
      forbidNonWhitelisted: true, // Throw error nếu có property không được cho phép
      transform: true, // Tự động transform types
      transformOptions: {
        enableImplicitConversion: true, // Convert string to number tự động
      },
    }),
  );

  const port = configService.get('PORT') || 8000;
  await app.listen(port);
  console.log(`🚀 Backend server running on port ${port}`);
}
bootstrap();
