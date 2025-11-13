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
// import { LocalAuthGuard } from './guards/local-auth.guard'; // <-- Import (1)
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // <-- Import (2)
import { LoginUserDto } from './dto/login-user.dto';
import { RolesGuard } from './guards/roles.guard'; // ⭐️ 1. Import
import { Roles } from './decorators/roles.decorator'; // ⭐️ 2. Import

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard) // ⭐️ 3. เรียกยาม 2 คน
  @Roles('admin', 'user') // ⭐️ 4. แปะป้าย: Admin หรือ User ก็ได้
  getProfile(@Request() req: any) {
    return req.user;
  }
}
