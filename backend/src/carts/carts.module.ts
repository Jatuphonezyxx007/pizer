import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- เพิ่ม
import { Cart } from './entities/cart.entity'; // <-- เพิ่ม
import { CartItem } from './entities/cart-item.entity'; // <-- เพิ่ม
import { ProductsModule } from 'src/products/products.module'; // <-- เพิ่ม

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]), // <-- เพิ่ม
    ProductsModule, // <-- Import เข้ามา เพราะเราต้องใช้ ProductVariant
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
