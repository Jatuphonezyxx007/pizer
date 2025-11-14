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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // --- Endpoint สำหรับ User ทั่วไป (จัดการโปรไฟล์ตัวเอง) ---

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    // req.user มาจาก JwtAuthGuard (ดูใน jwt.strategy.ts)
    // มันมี { userId: number, username: string, roles: string[] }
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Post('profile/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      // 'avatar' คือ key ใน FormData ที่ส่งมาจาก frontend
      storage: diskStorage({
        destination: './assets/uploads/users/profiles',
        filename: (req, file, cb) => {
          const user = (req as any).user;
          if (!user || !user.username) {
            // 🛑 FIX: เปลี่ยน null เป็น '' (string ว่าง)
            return cb(new BadRequestException('User not found in token'), '');
          }
          // 1. Sanitize username (ป้องกัน path traversal)
          const safeUsername = user.username
            .replace(/[^a-z0-9_.-]/gi, '_')
            .toLowerCase();
          // 2. ดึงนามสกุลไฟล์เดิม
          const extension = path.extname(file.originalname);
          // 3. ตั้งชื่อไฟล์ใหม่: username.extension
          cb(null, `${safeUsername}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Only JPEG, PNG, WEBP are allowed.',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadAvatar(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    // file.filename คือชื่อใหม่ที่เราตั้ง (เช่น 'jatuphon.png')
    // file.mimetype คือชนิดไฟล์ (เช่น 'image/png')
    return this.usersService.updateAvatar(
      req.user.userId,
      file.filename,
      file.mimetype,
    );
  }

  // --- Endpoints สำหรับ Admin (จัดการ User ทั้งหมด) ---
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    // (หมายเหตุ: การสร้าง User ควรทำผ่าน /auth/register
    // Endpoint นี้สำหรับ Admin สร้าง User โดยตรง)
    return this.usersService.create(createUserDto);
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
