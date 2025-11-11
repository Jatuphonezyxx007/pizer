import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'; // <-- แก้ไขบรรทัดนี้

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Security Headers
  app.use(helmet()); // <-- ตอนนี้จะทำงานได้แล้ว

  // 2. Strict CORS Policy
  app.enableCors({
    origin: [
      'http://localhost:5173', // (Dev)
      'https://your-vue-app.com', // (Prod)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 4. API Prefix (Best Practice)
  app.setGlobalPrefix('api/v1');

  // Start server
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
