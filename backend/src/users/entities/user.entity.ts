import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { InfoPersonal } from './info-personal.entity'; // <-- Import เพิ่ม
import { Address } from './address.entity'; // <-- Import เพิ่ม

// สร้าง Enum สำหรับ status
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@Entity('users') // ตาราง users
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string; // เราจะเก็บ Hashed Password ที่นี่

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  // --- ความสัมพันธ์ (Relationships) ---

  @OneToOne(() => InfoPersonal, (info) => info.user)
  info_personal: InfoPersonal;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}
