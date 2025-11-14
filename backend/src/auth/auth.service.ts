import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException, // <-- 1. Import
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HttpService } from '@nestjs/axios'; // <-- 2. Import
import { ConfigService } from '@nestjs/config'; // <-- 3. Import
import { firstValueFrom } from 'rxjs'; // <-- 4. Import
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly httpService: HttpService, // <-- 5. Inject
    private readonly configService: ConfigService, // <-- 6. Inject
  ) {}

  // --- ⭐️ เพิ่มฟังก์ชันสำหรับตรวจสอบ reCAPTCHA ⭐️ ---
  private async verifyRecaptcha(token: string): Promise<boolean> {
    const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
      const response = await firstValueFrom(this.httpService.post(url));
      const { success, score } = response.data;

      // สำหรับ v3 เราจะตรวจสอบ score ด้วย (เช่น ต้องมากกว่า 0.5)
      // คุณสามารถปรับค่า 0.5 นี้ได้ตามความเหมาะสม
      return success && score > 0.5;
    } catch (error) {
      console.error('reCAPTCHA verification failed:', error);
      return false;
    }
  }

  // --- (validateUser และ login method เหมือนเดิม) ---
  async validateUser(identifier: string, pass: string): Promise<any> {
    // ⭐️ 2. แก้ไข: ใช้ method ใหม่ (ที่เราจะสร้างใน UsersService)
    const user = await this.usersService.findOneByIdentifier(identifier);
    if (!user) {
      return null; // ไม่พบผู้ใช้
    }

    // ⭐️ 3. ตรวจสอบรหัสผ่าน (เหมือนเดิม)
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null; // รหัสผ่านไม่ตรง
  }
  /**
   * 2. ล็อกอิน (อัปเกรดแล้ว)
   * รับ DTO, ตรวจสอบ reCAPTCHA, ตรวจสอบ user, แล้วค่อยสร้าง Token
   */
  async login(loginUserDto: LoginUserDto) {
    // ⭐️ 4. แก้ไข: รับ DTO
    // ⭐️ 5. (เพิ่ม) ตรวจสอบ reCAPTCHA ก่อน
    const isHuman = await this.verifyRecaptcha(loginUserDto.recaptchaToken);
    if (!isHuman) {
      throw new ForbiddenException('reCAPTCHA verification failed.');
    }

    // ⭐️ 6. (ย้าย) ตรวจสอบ User
    const user = await this.validateUser(
      loginUserDto.identifier,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ⭐️ 7. สร้าง Token (อัปเกรด)
    const payload = {
      username: user.username,
      sub: user.id,
      // ⭐️ แก้ไข: แปลง Array of Objects เป็น Array of Strings
      roles: user.roles.map((role) => role.name),
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: user, // ส่ง user data กลับไปด้วย
    };
  }

  /**
   * 3. สมัครสมาชิก (อัปเกรดแล้ว)
   */
  async register(createUserDto: CreateUserDto) {
    // ⭐️ 3.0 (เพิ่ม) ตรวจสอบ reCAPTCHA ก่อน!!
    const isHuman = await this.verifyRecaptcha(createUserDto.recaptchaToken);
    if (!isHuman) {
      throw new ForbiddenException(
        'reCAPTCHA verification failed. Are you a robot?',
      );
    }

    // 3.1 ตรวจสอบ Email ซ้ำ
    // 🛑 FIX: แก้ findOneByEmail -> findByEmail
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 3.2 (เพิ่ม) ตรวจสอบเบอร์โทรซ้ำ (ถ้ามีการส่งเบอร์มา)
    if (createUserDto.phone) {
      // (เราจะสร้าง findOneByPhone ใน UsersService)
      const existingPhone = await this.usersService.findOneByPhone(
        createUserDto.phone,
      );
      if (existingPhone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // 3.3 ลบ recaptchaToken ออกจาก DTO ก่อนส่งไปสร้าง user
    // (เราจะ map field แทนการส่ง DTO ตรงๆ)

    // 3.4 Hash รหัสผ่าน
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    // 3.5 สร้าง User object ใหม่
    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
    };

    // 3.6 บันทึกลงฐานข้อมูล
    try {
      const createdUser = await this.usersService.create(userToCreate);

      // 3.7 (สำคัญ) การลบ password จะทำที่นี่ (AuthService)
      // UsersService.create จะ return user object แบบมี password
      const { password, ...result } = createdUser;
      return result;
    } catch (error) {
      // 3.8 (อัปเกรด) ตรวจจับ Error จาก DB (เช่น Username ซ้ำ)
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('username')) {
          throw new ConflictException('Username already exists');
        }
      }
      throw new ConflictException(error.message);
    }
  }
}
