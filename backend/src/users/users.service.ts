import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DataSource, Not } from 'typeorm'; // <-- 1. Import DataSource
import { InfoPersonal } from './entities/info-personal.entity'; // <-- 2. Import InfoPersonal
import { RolesService } from 'src/roles/roles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
    private rolesService: RolesService,
  ) {}

  /**
   * สร้าง User และ InfoPersonal พร้อมกันใน Transaction (ปลอดภัย)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, phone, recaptchaToken, ...userDto } =
      createUserDto;

    // ⭐️ 3. ค้นหา Role 'user'
    const defaultRole = await this.rolesService.findByName('user');
    if (!defaultRole) {
      throw new NotFoundException(
        '"user" role not found. Please seed database.',
      );
    }

    // สร้าง Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ⭐️ 4. สร้าง User พร้อมกับ Role
      const user = this.usersRepository.create({
        ...userDto,
        roles: [defaultRole], // ⭐️ ผูก Role 'user' ให้เลย
      });
      const savedUser = await queryRunner.manager.save(user);

      // 5. สร้าง InfoPersonal (เหมือนเดิม)
      const info = this.infoPersonalRepository.create({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        user: savedUser,
        user_id: savedUser.id,
      });
      await queryRunner.manager.save(info);

      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
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

  // ⭐️ 4. (เพิ่ม) Method สำหรับดึงโปรไฟล์
  async getProfile(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['info_personal', 'roles'], // ⭐️ ดึงข้อมูล InfoPersonal มาด้วย
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // ⭐️ 4. (เพิ่ม) Method สำหรับดึงโปรไฟล์
  async getProfile(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['info_personal', 'roles'], // ⭐️ ดึงข้อมูล InfoPersonal มาด้วย
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // ⭐️ 5. (เพิ่ม) Method สำหรับอัปเดตโปรไฟล์ (Logic หลัก)
  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    // ⭐️ ตรวจสอบ Email ซ้ำ (โดยไม่นับตัวเอง)
    if (dto.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: dto.email, id: Not(userId) }, // ⭐️ id != userId
      });
      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }

    // ⭐️ ตรวจสอบเบอร์โทรซ้ำ (โดยไม่นับตัวเอง)
    if (dto.phone) {
      const existing = await this.infoPersonalRepository.findOne({
        where: { phone: dto.phone, user_id: Not(userId) }, // ⭐️ user_id != userId
      });
      if (existing) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // ⭐️ ใช้ Transaction เพื่ออัปเดต 2 ตารางพร้อมกัน (ปลอดภัยที่สุด)
    return this.dataSource.transaction(async (manager) => {
      // 1. ดึงข้อมูล
      const user = await manager.findOneBy(User, { id: userId });
      const info = await manager.findOneBy(InfoPersonal, { user_id: userId });

      if (!user || !info) {
        throw new NotFoundException('User or Profile not found');
      }

      // 2. อัปเดตตาราง 'users'
      manager.merge(User, user, {
        username: dto.username,
        email: dto.email,
      });
      await manager.save(user);

      // 3. อัปเดตตาราง 'info_personal'
      manager.merge(InfoPersonal, info, {
        first_name: dto.firstName, // ⭐️ แมปชื่อ field (dto.firstName -> info.first_name)
        last_name: dto.lastName,
        phone: dto.phone,
        gender: dto.gender,
        birth_date: dto.birthdate ? new Date(dto.birthdate) : undefined,
      });
      await manager.save(info);

      // 4. คืนค่า User ที่อัปเดตแล้ว (รวมข้อมูลใหม่)
      // (เราต้อง query ใหม่เพื่อให้ได้ข้อมูลที่ 'relations' ครบ)
      return this.getProfile(userId);
    });
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
