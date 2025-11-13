import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Gender } from '../entities/info-personal.entity'; //

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string; // (ตรงกับ name ใน Profile.vue)

  @IsString()
  @IsOptional()
  lastName?: string; // (ตรงกับ lastName ใน Profile.vue)

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsDateString()
  @IsOptional()
  birthdate?: string; // (ตรงกับ birthdate ใน Profile.vue)

  // เราจะจัดการ avatarUrl แยกต่างหาก (ในอนาคต)
}
