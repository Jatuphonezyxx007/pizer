import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  // เราไม่ควรให้ผู้ใช้กำหนด status เองตอนสมัคร
  // แต่ถ้าจำเป็นต้องมี ก็ใส่ IsOptional()
  // @IsEnum(UserStatus)
  // @IsOptional()
  // status: UserStatus;
}
