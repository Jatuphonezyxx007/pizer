import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DataSource } from 'typeorm'; // <-- 1. Import DataSource
import { InfoPersonal } from './entities/info-personal.entity'; // <-- 2. Import InfoPersonal

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    // 3. ฉีด Repository ของ InfoPersonal
    @InjectRepository(InfoPersonal)
    private infoPersonalRepository: Repository<InfoPersonal>,

    // 4. ฉีด DataSource เพื่อใช้ Transaction
    private dataSource: DataSource,
  ) {}

  /**
   * สร้าง User และ InfoPersonal พร้อมกันใน Transaction (ปลอดภัย)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, phone, recaptchaToken, ...userDto } =
      createUserDto;

    // สร้าง Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. สร้าง User
      const user = this.usersRepository.create(userDto);
      const savedUser = await queryRunner.manager.save(user);

      // 2. สร้าง InfoPersonal
      const info = this.infoPersonalRepository.create({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        user: savedUser, // เชื่อมความสัมพันธ์
        user_id: savedUser.id,
      });
      await queryRunner.manager.save(info);

      // 3. ถ้าสำเร็จทั้งคู่ -> ยืนยัน
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err) {
      // 4. ถ้าล้มเหลว -> ยกเลิกทั้งหมด
      await queryRunner.rollbackTransaction();
      throw err; // โยน error กลับไปให้ AuthService
    } finally {
      // 5. ปิดการเชื่อมต่อ
      await queryRunner.release();
    }
  }

  /**
   * ค้นหา User ด้วย Email (สำหรับ AuthService)
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  /**
   * ⭐️ เพิ่ม: ค้นหาด้วยเบอร์โทร (สำหรับ AuthService)
   */
  async findOneByPhone(phone: string): Promise<InfoPersonal | null> {
    return this.infoPersonalRepository.findOne({ where: { phone } });
  }

  /**
   * ⭐️ เพิ่ม: ค้นหาด้วย Identifier (Email, Username, หรือ Phone)
   */
  async findOneByIdentifier(identifier: string): Promise<User | null> {
    // 1. ลองค้นหาด้วย Email
    let user = await this.usersRepository.findOne({
      where: { email: identifier },
      relations: ['roles'],
    });
    if (user) return user;

    // 2. ลองค้นหาด้วย Username
    user = await this.usersRepository.findOne({
      where: { username: identifier },
      relations: ['roles'],
    });
    if (user) return user;

    // 3. ลองค้นหาด้วย Phone (ต้อง Join ตาราง InfoPersonal)
    const info = await this.infoPersonalRepository.findOne({
      where: { phone: identifier },
      relations: ['user', 'user.roles'], // ‼️ ต้องดึง user และ roles ของ user มาด้วย
    });

    return info ? info.user : null;
  }

  // --- (Method ที่เหลือ findOne, findAll, update, remove เหมือนเดิม) ---
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['info_personal', 'addresses', 'roles'],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
