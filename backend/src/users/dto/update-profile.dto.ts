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
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsDateString()
  @IsOptional()
  birthdate?: string;
}
