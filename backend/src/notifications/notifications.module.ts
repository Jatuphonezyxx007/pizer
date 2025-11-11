import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- เพิ่ม
import { Notification } from './entities/notification.entity'; // <-- เพิ่ม
import { UsersModule } from 'src/users/users.module'; // <-- เพิ่ม (เพราะเชื่อมกับ User)

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]), // <-- เพิ่ม
    UsersModule, // <-- เพิ่ม
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
