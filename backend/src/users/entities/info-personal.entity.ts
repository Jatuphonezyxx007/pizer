import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

// 🛑 FIX: สร้างและ Export Enum
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  NOT_SPECIFIED = 'not_specified',
}

@Entity('info_personal')
export class InfoPersonal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @OneToOne(() => User, (user) => user.info_personal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null; // 🛑 FIX: เพิ่ม | null

  @Column({ type: 'date', nullable: true })
  birth_date: Date | null; // 🛑 FIX: เพิ่ม | null

  @Column({
    type: 'enum',
    enum: Gender, // 🛑 FIX: ใช้ Enum ที่ export
    default: Gender.NOT_SPECIFIED,
  })
  gender: Gender; // 🛑 FIX: ใช้ Type เป็น Gender

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_image: string | null; // 🛑 FIX: เพิ่ม | null

  @Column({ type: 'varchar', length: 50, nullable: true })
  profile_image_mimetype: string | null; // 🛑 FIX: เพิ่ม | null

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
