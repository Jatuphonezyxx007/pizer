import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  /**
   * นี่คือ Method ที่จะถูกเรียก "หลังจาก" Token ถูกตรวจสอบว่าถูกต้องแล้ว
   * (ถ้า Token ไม่ถูกต้อง มันจะโยน 401 Error ให้อัตโนมัติ)
   * payload คือข้อมูลที่เรา "ยัดไส้" ไว้ใน Token ตอน Login
   */
  async validate(payload: any) {
    // สิ่งที่เรา return จากตรงนี้...
    // จะถูกนำไปแปะไว้ที่ request.user
    return {
      userId: payload.sub, // 'sub' ที่เราตั้งค่าไว้
      username: payload.username,
      roles: payload.roles,
    };
  }
}
