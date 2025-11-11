import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// 'local' คือชื่อ default strategy ที่ passport-local ตั้งไว้
export class LocalAuthGuard extends AuthGuard('local') {}
