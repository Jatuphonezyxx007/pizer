import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard'; // <-- Import (1)
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // <-- Import (2)

@Controller('auth') // API ทั้งหมดจะขึ้นต้นด้วย /api/v1/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 1. API สมัครสมาชิก (Register)
   * (POST /api/v1/auth/register)
   * ไม่ต้องมี Guard (เพราะเป็นสาธารณะ)
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // ValidationPipe (ที่เราตั้งใน main.ts) จะตรวจสอบ createUserDto ก่อน
    // จากนั้นจึงส่งไปให้ AuthService.register (ที่ทำการ Hash รหัสผ่าน)
    return this.authService.register(createUserDto);
  }

  /**
   * 2. API เข้าสู่ระบบ (Login)
   * (POST /api/v1/auth/login)
   */
  @UseGuards(LocalAuthGuard) // <-- แปะป้าย! (1)
  @Post('login')
  async login(@Request() req: any) {
    // 1. @UseGuards(LocalAuthGuard) จะทำงานก่อน
    // 2. มันจะเรียก LocalStrategy (ยาม)
    // 3. ยามจะเรียก authService.validateUser(...)
    // 4. ถ้าผ่าน ยามจะเอา 'user' (ที่ไม่มีรหัสผ่าน) มาแปะไว้ที่ req.user
    // 5. AuthService.login จะถูกเรียก โดยใช้ข้อมูลจาก req.user
    return this.authService.login(req.user);
  }

  /**
   * 3. API ทดสอบการป้องกัน (Profile)
   * (GET /api/v1/auth/profile)
   */
  @UseGuards(JwtAuthGuard) // <-- แปะป้าย! (2)
  @Get('profile')
  getProfile(@Request() req: any) {
    // 1. @UseGuards(JwtAuthGuard) จะทำงานก่อน
    // 2. มันจะเรียก JwtStrategy (ยาม)
    // 3. ยามจะตรวจสอบ Token จาก Header
    // 4. ถ้า Token ถูกต้อง ยามจะเอา payload (ที่ validate แล้ว) มาแปะที่ req.user
    // 5. เราสามารถดึงข้อมูลผู้ใช้จาก req.user ได้เลย
    return req.user;
    // req.user จะมีหน้าตาแบบนี้: { userId: 1, username: 'test', roles: [...] }
  }
}
