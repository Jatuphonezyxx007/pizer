import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DataSource, Not } from 'typeorm';
import { InfoPersonal } from './entities/info-personal.entity';
import { RolesService } from 'src/roles/roles.service'; //
import { UpdateProfileDto } from './dto/update-profile.dto'; // (ไฟล์ที่เราเพิ่งสร้าง)

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(InfoPersonal)
    private infoPersonalRepository: Repository<InfoPersonal>,
    private dataSource: DataSource,
    private rolesService: RolesService,
  ) {}

  /**
   * สร้าง User และ InfoPersonal (จาก Auth)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, phone, recaptchaToken, ...userDto } =
      createUserDto;

    const defaultRole = await this.rolesService.findByName('user');
    if (!defaultRole) {
      throw new NotFoundException(
        '"user" role not found. Please seed database.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.usersRepository.create({
        ...userDto,
        roles: [defaultRole],
      });
      const savedUser = await queryRunner.manager.save(user);

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

  // --- (ฟังก์ชันสำหรับ Auth) ---

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async findOneByPhone(phone: string): Promise<InfoPersonal | null> {
    return this.infoPersonalRepository.findOne({ where: { phone } });
  }

  async findOneByIdentifier(identifier: string): Promise<User | null> {
    let user = await this.usersRepository.findOne({
      where: { email: identifier },
      relations: ['roles', 'info_personal'],
    });
    if (user) return user;

    user = await this.usersRepository.findOne({
      where: { username: identifier },
      relations: ['roles', 'info_personal'],
    });
    if (user) return user;

    const info = await this.infoPersonalRepository.findOne({
      where: { phone: identifier },
      relations: ['user', 'user.roles', 'user.info_personal'],
    });

    return info ? info.user : null;
  }

  // --- (ฟังก์ชันสำหรับ Profile) ---

  async getProfile(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['info_personal', 'roles'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    if (dto.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: dto.email, id: Not(userId) },
      });
      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }

    if (dto.phone) {
      const existing = await this.infoPersonalRepository.findOne({
        where: { phone: dto.phone, user_id: Not(userId) },
      });
      if (existing) {
        throw new ConflictException('Phone number already exists');
      }
    }

    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOneBy(User, { id: userId });
      const info = await manager.findOneBy(InfoPersonal, { user_id: userId });

      if (!user || !info) {
        throw new NotFoundException('User or Profile not found');
      }

      manager.merge(User, user, {
        username: dto.username,
        email: dto.email,
      });
      await manager.save(user);

      manager.merge(InfoPersonal, info, {
        first_name: dto.firstName,
        last_name: dto.lastName,
        phone: dto.phone,
        gender: dto.gender,
        birth_date: dto.birthdate ? new Date(dto.birthdate) : undefined,
      });
      await manager.save(info);

      return this.getProfile(userId);
    });
  }

  // --- (ฟังก์ชัน CRUD สำหรับ Admin) ---

  findAll() {
    return this.usersRepository.find({ relations: ['info_personal', 'roles'] });
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
