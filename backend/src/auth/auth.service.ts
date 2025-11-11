import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto'; // เราจะใช้ DTO จาก Users
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * 1. ตรวจสอบผู้ใช้ (สำหรับ LocalStrategy)
   * ใช้สำหรับตรวจสอบ username (หรือ email) และ password ตอน Login
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email); // (เดี๋ยวเราต้องสร้าง method นี้ใน UsersService)
    if (!user) {
      return null; // ไม่พบผู้ใช้
    }

    // --- 🔑 ตรวจสอบรหัสผ่าน ---
    // เปรียบเทียบรหัสผ่านที่ส่งมา (pass) กับรหัสผ่านที่ Hash ไว้ใน DB (user.password)
    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      // ถ้ารหัสผ่านตรงกัน ให้ส่งข้อมูล user กลับไป (แต่ลบรหัสผ่านออก)
      const { password, ...result } = user;
      return result;
    }
    return null; // รหัสผ่านไม่ตรง
  }

  /**
   * 2. ล็อกอิน (สำหรับ /auth/login)
   * สร้าง JWT Token หลังจากที่ validateUser สำเร็จแล้ว
   */
  async login(user: any) {
    // 'user' ที่ได้มาคือ 'result' จาก validateUser (ที่ไม่มีรหัสผ่านแล้ว)
    const payload = {
      username: user.username,
      sub: user.id, // 'sub' (Subject) คือ ID ของผู้ใช้
      roles: user.roles, // (Bonus) ใส่ roles เข้าไปใน Token ด้วย
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * 3. สมัครสมาชิก (สำหรับ /auth/register)
   * นี่คือส่วนที่ทำการ Hash รหัสผ่านครับ
   */
  async register(createUserDto: CreateUserDto) {
    // 3.1 ตรวจสอบว่ามี email นี้ในระบบหรือยัง
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists'); // 409 Conflict
    }

    // --- 🔐 Hash รหัสผ่าน ---
    const saltOrRounds = 10; // ความปลอดภัย (ยิ่งเยอะ ยิ่งช้า ยิ่งปลอดภัย)
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    // 3.2 สร้าง User object ใหม่ โดยแทนที่ password ธรรมดาด้วยตัวที่ Hash แล้ว
    const newUser = {
      ...createUserDto,
      password: hashedPassword, // <-- ใช้รหัสผ่านที่ Hash แล้ว
    };

    // 3.3 บันทึกลงฐานข้อมูล (เดี๋ยวเราต้องสร้าง method นี้ใน UsersService)
    try {
      const createdUser = await this.usersService.create(newUser);
      // ไม่ส่งรหัสผ่านกลับไป
      const { password, ...result } = createdUser;
      return result;
    } catch (error) {
      // จัดการ Error (เช่น username ซ้ำ)
      throw new ConflictException(error.message);
    }
  }
}
