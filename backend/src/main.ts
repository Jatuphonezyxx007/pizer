import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet'; // <-- แก้ไขบรรทัดนี้
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path'; // ⭐️ 2. Import เพิ่ม

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ⭐️ 4. (เพิ่ม) อนุญาตให้เสิร์ฟไฟล์จากโฟลเดอร์ 'assets'
  // นี่จะแมป URL http://localhost:3000/assets/ ไปยังโฟลเดอร์ backend/assets
  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets',
  });

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
