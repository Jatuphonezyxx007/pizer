import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // กำหนดให้ 'usernameField' คือ 'email'
    // เพราะ Passport จะใช้ 'username' เป็นค่าเริ่มต้น
    super({ usernameField: 'email' });
  }

  /**
   * นี่คือ Method ที่ Passport จะเรียกอัตโนมัติ
   * มันจะเอา email และ password จาก body มาส่งให้เรา
   */
  async validate(email: string, password: string): Promise<any> {
    // เรียกใช้ Method ที่เราสร้างไว้ใน AuthService
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      // ถ้ายืนยันตัวตนไม่สำเร็จ (user เป็น null)
      throw new UnauthorizedException('Invalid credentials'); // 401 Unauthorized
    }
    return user; // ถ้าสำเร็จ ส่ง user กลับไป
  }
}
