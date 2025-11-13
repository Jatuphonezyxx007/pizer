import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. ดึง Role ที่ "ต้องการ" จาก @Roles('admin')
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; // ถ้าไม่ได้กำหนด @Roles, ให้ผ่าน (ปล่อยให้ JwtAuthGuard ทำงาน)
    }

    // 2. ดึง Role "ที่มี" จาก User ใน Token
    const { user } = context.switchToHttp().getRequest();
    // (เรามั่นใจว่า user.roles เป็น ['user'] เพราะเราแก้ใน AuthService.login แล้ว)
    if (!user || !user.roles) {
      return false; // ไม่มีข้อมูล user หรือ roles
    }

    // 3. ตรวจสอบว่า Role ที่มี ตรงกับ Role ที่ต้องการหรือไม่
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
