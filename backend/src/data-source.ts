import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// โหลดไฟล์ .env เข้าสู่ process.env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT), // แปลงเป็น number
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false, // <-- ต้องเป็น false เสมอสำหรับ Migrations

  // ชี้ไปที่ไฟล์ Entity ของเรา (สำคัญมาก)
  entities: ['src/**/*.entity.ts'],

  // กำหนดที่อยู่ของไฟล์ Migration ที่เราจะสร้าง
  migrations: ['src/migrations/*.ts'],
});
