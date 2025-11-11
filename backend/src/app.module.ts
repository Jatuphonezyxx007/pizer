import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ConfigService ถูก import เพิ่ม
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Import เพิ่ม

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { RefundsModule } from './refunds/refunds.module';
import { InvoicesModule } from './invoices/invoices.module';
import { CouponsModule } from './coupons/coupons.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SettingsModule } from './settings/settings.module';
import { LogsModule } from './logs/logs.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // --- ส่วนที่เพิ่มเข้ามา ---
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // บอกว่าเราจะใช้ ConfigModule
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // สแกนหาไฟล์ .entity ทั้งหมด
        synchronize: false, //  **สำคัญมาก** สำหรับ Production ต้องเป็น false
      }),
      inject: [ConfigService], // ฉีด ConfigService เข้ามาใช้งาน
    }),

    UsersModule,

    RolesModule,

    CategoriesModule,

    ProductsModule,

    ReviewsModule,

    CartsModule,

    OrdersModule,

    PaymentsModule,

    ShipmentsModule,

    RefundsModule,

    InvoicesModule,

    CouponsModule,

    NotificationsModule,

    SettingsModule,

    LogsModule,

    ReportsModule,

    AuthModule,

    // --- สิ้นสุดส่วนที่เพิ่ม ---
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
