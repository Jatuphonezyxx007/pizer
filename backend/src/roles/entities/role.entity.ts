import { User } from 'src/users/entities/user.entity'; // Import User
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string; // e.g., 'admin', 'customer', 'editor'

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  // --- ความสัมพันธ์ Many-to-Many กับ User ---
  @ManyToMany(() => User, (user) => user.roles)
  // (ฝั่งนี้ไม่ต้องมี @JoinTable)
  users: User[];
}
