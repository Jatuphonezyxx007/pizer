import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- เพิ่ม
import { Setting } from './entities/setting.entity'; // <-- เพิ่ม

@Module({
  imports: [TypeOrmModule.forFeature([Setting])], // <-- เพิ่ม
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
