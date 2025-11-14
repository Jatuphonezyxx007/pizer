import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional } from 'class-validator'; // 🛑 FIX: Import
import { UserStatus } from '../entities/user.entity'; // 🛑 FIX: Import

// PartialType จะเอา DTO ตัวแม่ (CreateUserDto)
// มาแปลงให้ทุก field เป็น Optional (ไม่จำเป็นต้องส่งมา)
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // 🛑 FIX: เพิ่ม field 'status' สำหรับ Admin
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}
