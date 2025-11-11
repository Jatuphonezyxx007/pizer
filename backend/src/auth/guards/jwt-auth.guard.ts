import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// 'jwt' คือชื่อ default strategy ที่ passport-jwt ตั้งไว้
export class JwtAuthGuard extends AuthGuard('jwt') {}
