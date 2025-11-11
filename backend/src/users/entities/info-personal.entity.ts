import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('info_personal')
export class InfoPersonal {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  // นี่คือ Foreign Key (FK)
  @Column({ type: 'bigint' })
  user_id: number;

  @OneToOne(() => User, (user) => user.info_personal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // บอกว่า user_id คือ FK
  user: User;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_image: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
