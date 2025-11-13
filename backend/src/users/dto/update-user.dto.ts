import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType จะเอา DTO ตัวแม่ (CreateUserDto)
// มาแปลงให้ทุก field เป็น Optional (ไม่จำเป็นต้องส่งมา)
export class UpdateUserDto extends PartialType(CreateUserDto) {}
