import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { InfoPersonal } from './entities/info-personal.entity'; // <-- Import เพิ่ม
import { Address } from './entities/address.entity'; // <-- Import เพิ่ม
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      InfoPersonal, // <-- เพิ่ม
      Address, // <-- เพิ่ม
    ]),
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
