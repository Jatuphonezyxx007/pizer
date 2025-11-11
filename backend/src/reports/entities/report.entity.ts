import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum ReportType {
  SALES = 'sales',
  INVENTORY = 'inventory',
  USERS = 'users',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  generated_by_user_id: number; // Admin ที่สั่ง Generate

  @Column({ type: 'varchar', length: 255 })
  name: string; // เช่น 'Sales Report Q4 2025'

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_url: string; // Link ไปยังไฟล์ (เช่น .csv, .pdf)

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  // --- ความสัมพันธ์ ---
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'generated_by_user_id' })
  generated_by_user: User;
}
