import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  // Foreign Key (FK)
  @Column({ type: 'bigint' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  address_line: string;

  @Column({ type: 'varchar', length: 100 })
  street: string;

  // (เพิ่มคอลัมน์ที่เหลือ...)
  @Column({ type: 'varchar', length: 100 })
  sub_district: string;

  @Column({ type: 'varchar', length: 100 })
  district: string;

  @Column({ type: 'varchar', length: 100 })
  province: string;

  @Column({ type: 'varchar', length: 10 })
  zip_code: string;

  @Column({ type: 'varchar', length: 100, default: 'Thailand' })
  country: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
