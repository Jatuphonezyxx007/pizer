import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- เพิ่ม
import { Coupon } from './entities/coupon.entity'; // <-- เพิ่ม

@Module({
  imports: [TypeOrmModule.forFeature([Coupon])], // <-- เพิ่ม
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
