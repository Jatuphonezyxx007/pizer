import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// ⭐️ ลบ import ทั้ง 4 บรรทัดของ UsersController ออก

// ⭐️ ลบ @Controller('users') ... ทั้งหมด ⭐️

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
