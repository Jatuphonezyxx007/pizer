import { Module } from '@nestjs/common';
import { AuthService } from './auth.service'; // <-- Import เพิ่ม
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy'; // <-- Import (1)
import { JwtStrategy } from './jwt.strategy'; // <-- Import (2)

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy, // <-- ลงทะเบียนยามคนที่ 1
    JwtStrategy, // <-- ลงทะเบียนยามคนที่ 2
  ], // <-- เพิ่ม AuthService เข้าไป
})
export class AuthModule {}
