import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; //
import { RolesGuard } from 'src/auth/guards/roles.guard'; //
import { Roles } from 'src/auth/decorators/roles.decorator'; //
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // (POST /users ถูกจัดการโดย AuthController.register แล้ว)

  // (เพิ่ม) Endpoint สำหรับ "ดึง" ข้อมูลโปรไฟล์ของตัวเอง
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    // return this.usersService.getProfile(req.user.userId);
    return this.usersService.getProfile(req.user.userId);
  }

  // (เพิ่ม) Endpoint สำหรับ "อัปเดต" ข้อมูลโปรไฟล์ของตัวเอง
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    // return this.usersService.updateProfile(req.user.sub, updateProfileDto);
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  // --- (Endpoints เดิมสำหรับ Admin) ---
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
