import { Module } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { RefundsController } from './refunds.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Import ที่ขาดไป
import { Refund } from './entities/refund.entity'; // <-- Import ที่ขาดไป

@Module({
  imports: [TypeOrmModule.forFeature([Refund])],
  controllers: [RefundsController],
  providers: [RefundsService],
})
export class RefundsModule {}
