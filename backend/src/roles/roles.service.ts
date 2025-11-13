import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm'; // ⭐️ 1. Import
import { Role } from './entities/role.entity'; // ⭐️ 2. Import
import { Repository } from 'typeorm'; // ⭐️ 3. Import

@Injectable()
export class RolesService {
  // ⭐️ 4. เพิ่ม Constructor และฉีด Repository
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  // ⭐️ 5. เพิ่มฟังก์ชัน findByName
  findByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOne({ where: { name } });
  }

  // --- โค้ดเดิมที่ CLI สร้าง ---
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
