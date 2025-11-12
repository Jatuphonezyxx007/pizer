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

// ... (imports) ...
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // ... (validateUser และ login method เหมือนเดิม) ...
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  /**
   * 3. สมัครสมาชิก (อัปเกรดแล้ว)
   */
  async register(createUserDto: CreateUserDto) {
    // 3.1 ตรวจสอบ Email ซ้ำ
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // ⭐️ 3.2 (เพิ่ม) ตรวจสอบเบอร์โทรซ้ำ (ถ้ามีการส่งเบอร์มา)
    if (createUserDto.phone) {
      const existingPhone = await this.usersService.findOneByPhone(
        createUserDto.phone,
      );
      if (existingPhone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // (Username จะถูกตรวจสอบโดยอัตโนมัติที่ระดับ DB เพราะเราตั้ง UNIQUE ไว้)

    // 3.3 Hash รหัสผ่าน
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    // 3.4 สร้าง User object ใหม่
    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
    };

    // 3.5 บันทึกลงฐานข้อมูล (ส่ง DTO ทั้งก้อนไปให้ UsersService)
    try {
      const createdUser = await this.usersService.create(userToCreate);
      const { password, ...result } = createdUser;
      return result;
    } catch (error) {
      // 3.6 (อัปเกรด) ตรวจจับ Error จาก DB (เช่น Username ซ้ำ)
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('username')) {
          throw new ConflictException('Username already exists');
        }
      }
      throw new ConflictException(error.message);
    }
  }
}
