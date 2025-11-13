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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ⭐️ 4. (เพิ่ม) Endpoint สำหรับ "ดึง" ข้อมูลโปรไฟล์ของตัวเอง
  @Get('profile')
  @UseGuards(JwtAuthGuard) // ⭐️ ป้องกัน: ต้อง Login เท่านั้น
  getProfile(@Request() req: any) {
    // ใช้ ID จาก Token (req.user.sub) ปลอดภัยที่สุด
    return this.usersService.getProfile(req.user.sub); // (เราจะสร้าง method นี้)
  }

  // ⭐️ 5. (เพิ่ม) Endpoint สำหรับ "อัปเดต" ข้อมูลโปรไฟล์ของตัวเอง
  @Patch('profile')
  @UseGuards(JwtAuthGuard) // ⭐️ ป้องกัน: ต้อง Login เท่านั้น
  updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    // ใช้ ID จาก Token (req.user.sub) ปลอดภัยที่สุด
    return this.usersService.updateProfile(req.user.sub, updateProfileDto); // (เราจะสร้าง method นี้)
  }

  // --- (Endpoints เดิมสำหรับ Admin) ---
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
