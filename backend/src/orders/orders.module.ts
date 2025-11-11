import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- เพิ่ม
import { Order } from './entities/order.entity'; // <-- เพิ่ม
import { OrderDetail } from './entities/order-detail.entity'; // <-- เพิ่ม
import { ProductsModule } from 'src/products/products.module'; // <-- เพิ่ม (สำหรับ ProductVariant)
import { UsersModule } from 'src/users/users.module'; // <-- เพิ่ม (สำหรับ User และ Address)

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]), // <-- เพิ่ม
    ProductsModule, // <-- Import
    UsersModule, // <-- Import
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
