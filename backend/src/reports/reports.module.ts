import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- เพิ่ม
import { Report } from './entities/report.entity'; // <-- เพิ่ม
import { UsersModule } from 'src/users/users.module'; // <-- เพิ่ม (เพราะเชื่อมกับ User)

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]), // <-- เพิ่ม
    UsersModule, // <-- เพิ่ม
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
