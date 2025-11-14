import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InfoPersonal } from './entities/info-personal.entity';
import { RolesService } from 'src/roles/roles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(InfoPersonal)
    private infoPersonalRepository: Repository<InfoPersonal>,
    private rolesService: RolesService,
  ) {}

  // --- Service สำหรับ User ทั่วไป (จัดการโปรไฟล์ตัวเอง) ---

  async getProfile(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: [
        'info_personal',
        'addresses',
        'roles', // ส่ง roles ไปด้วย
      ],
      select: {
        // เลือกเฉพาะ field ที่จำเป็น
        id: true,
        username: true,
        email: true,
        status: true, // 🛑 FIX: แก้จาก is_active เป็น status
        roles: {
          id: true,
          name: true,
        },
        info_personal: {
          // เลือก field ทั้งหมดจาก info_personal
          id: true,
          first_name: true,
          last_name: true,
          phone: true,
          birth_date: true,
          gender: true,
          profile_image: true,
          profile_image_mimetype: true, // ส่ง mimetype ไปด้วย
        },
        addresses: true, // ส่ง addresses ไปด้วย (ถ้ามี)
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<InfoPersonal> {
    // 🛑 หมายเหตุ: DTO นี้อนุญาตให้แก้ username/email
    // ซึ่งอาจทับซ้อนกับ Admin Endpoint (PATCH /:id)
    // และอาจต้องมีการตรวจสอบ unique constraint
    const { username, email, ...infoData } = updateProfileDto;

    // 1. อัปเดต User (ถ้ามี)
    if (username || email) {
      const user = await this.usersRepository.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('User not found');

      if (username) user.username = username;
      if (email) user.email = email;
      // (ควรเพิ่ม try-catch สำหรับ unique constraint errors ที่นี่)
      await this.usersRepository.save(user);
    }

    // 2. อัปเดต InfoPersonal
    const info = await this.infoPersonalRepository.findOne({
      where: { user_id: userId },
    });
    if (!info) {
      throw new NotFoundException('User profile not found');
    }
    Object.assign(info, infoData);
    return this.infoPersonalRepository.save(info);
  }

  async updateAvatar(
    userId: number,
    newFilename: string,
    newMimeType: string,
  ): Promise<InfoPersonal> {
    const info = await this.infoPersonalRepository.findOne({
      where: { user_id: userId },
    });
    if (!info) {
      throw new NotFoundException('User profile not found');
    }

    const oldFilename = info.profile_image;
    const uploadPath = path.join(
      process.cwd(),
      'assets',
      'uploads',
      'users',
      'profiles',
    );

    // 1. อัปเดตฐานข้อมูล
    info.profile_image = newFilename;
    info.profile_image_mimetype = newMimeType;

    try {
      const updatedInfo = await this.infoPersonalRepository.save(info);

      // 2. ลบไฟล์เก่า (ถ้ามี และไม่ซ้ำกับไฟล์ใหม่)
      if (oldFilename && oldFilename !== newFilename) {
        const oldFilePath = path.join(uploadPath, oldFilename);
        try {
          await fs.unlink(oldFilePath);
        } catch (err) {
          // ไม่ต้อง throw error, แค่ log ไว้
          // อาจเกิดกรณีไฟล์เก่าไม่มีอยู่แล้ว
          console.warn(
            `Failed to delete old avatar: ${oldFilePath}`,
            err.message,
          );
        }
      }

      return updatedInfo;
    } catch (dbError) {
      // 3. ถ้า DB พัง, ลบไฟล์ใหม่ที่เพิ่งอัปโหลด (Rollback)
      const newFilePath = path.join(uploadPath, newFilename);
      try {
        await fs.unlink(newFilePath);
      } catch (unlinkErr) {
        console.error(`Failed to rollback new avatar: ${newFilePath}`);
      }
      throw new ConflictException(
        'Failed to update database.',
        dbError.message,
      );
    }
  }

  // --- Service สำหรับ Admin และ AuthService ---

  findAll() {
    return this.usersRepository.find({ relations: ['info_personal', 'roles'] });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['info_personal', 'roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
    return user || undefined; // 🛑 FIX: แปลง null -> undefined
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    return user || undefined; // 🛑 FIX: แปลง null -> undefined
  }

  // 🛑 FIX: เพิ่ม method สำหรับ AuthService
  async findOneByIdentifier(identifier: string): Promise<User | undefined> {
    // ตรวจสอบว่าเป็น Email หรือ Username
    if (identifier.includes('@')) {
      return this.findByEmail(identifier);
    }
    return this.findByUsername(identifier);
  }

  // 🛑 FIX: เพิ่ม method สำหรับ AuthService
  async findOneByPhone(phone: string): Promise<User | undefined> {
    const info = await this.infoPersonalRepository.findOne({
      where: { phone: phone },
      relations: ['user', 'user.roles'], // โหลด user และ roles มาด้วย
    });
    return info?.user || undefined;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // (หมายเหตุ: AuthService ควร hash password ก่อนเรียกใช้ method นี้)

    // 1. ตรวจสอบ Role
    const defaultRole = await this.rolesService.findByName('user');
    if (!defaultRole) {
      throw new NotFoundException('Default role "user" not found');
    }

    // 2. สร้าง User
    const user = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password, // (password ที่ hash แล้วจาก AuthService)
      roles: [defaultRole],
      // (status จะมี default 'active' จาก entity)
    });
    const savedUser = await this.usersRepository.save(user);

    // 3. สร้าง InfoPersonal
    const info = this.infoPersonalRepository.create({
      user_id: savedUser.id,
      // 🛑 FIX: ใช้ DTO.camelCase
      first_name: createUserDto.firstName,
      last_name: createUserDto.lastName,
      phone: createUserDto.phone || null, // (Entity รับ null ได้แล้ว)
    });
    await this.infoPersonalRepository.save(info);

    // 🛑 FIX: ลบ 'delete' operator ออก, AuthService จะจัดการเอง
    return savedUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id); // (findOne มี check NotFound)

    // 🛑 FIX: แก้ไข field ให้ตรง DTO และ Entity (is_active -> status)
    this.usersRepository.merge(user, {
      username: updateUserDto.username,
      email: updateUserDto.email,
      status: updateUserDto.status, // (ใช้ status ที่เพิ่มใน DTO)
    });

    // (Update password ไม่ได้ทำใน flow นี้)
    if (updateUserDto.password) {
      // (ถ้าจะทำ ต้อง hash password ใหม่)
      // user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    // (เนื่องจากตั้งค่า 'onDelete: CASCADE' ใน Entity,
    // เมื่อลบ User, info_personal และ address จะถูกลบไปด้วย)
    await this.usersRepository.remove(user);
    return { message: `User ${user.username} (ID: ${id}) deleted.` };
  }
}
