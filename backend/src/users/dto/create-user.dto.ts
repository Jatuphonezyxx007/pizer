import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional, // <-- Import เพิ่ม
} from 'class-validator';
// (UserStatus ไม่จำเป็นต้องใช้ที่นี่แล้ว)

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

  // --- ⭐️ Field ที่เพิ่มเข้ามา ---
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional() // อนุญาตให้เป็นค่าว่างได้ (ถ้าคุณไม่บังคับกรอก)
  phone?: string;

  @IsString()
  @IsNotEmpty()
  recaptchaToken: string;
}
