import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // <-- ฉีด Repository ของ User เข้ามา
    private usersRepository: Repository<User>,
  ) {}

  /**
   * สร้าง User ใหม่ (ถูกเรียกโดย AuthService.register)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  /**
   * ค้นหา User ด้วย Email (ถูกเรียกโดย AuthService.validateUser)
   * เราต้องดึง "roles" มาด้วยเพื่อใช้ใน JWT
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles'], // <-- สำคัญ: ดึงข้อมูล roles มาพร้อมกัน
    });
  }

  // --- Method เดิมที่ CLI สร้างให้ ---
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['info_personal', 'addresses', 'roles'], // ดึงทุกอย่างที่เกี่ยวข้อง
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
