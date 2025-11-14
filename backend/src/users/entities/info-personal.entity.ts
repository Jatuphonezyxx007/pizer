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
  phone: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other', 'not_specified'],
    default: 'not_specified',
  })
  gender: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_image: string; // เช่น jatuphon.png

  @Column({ type: 'varchar', length: 50, nullable: true })
  profile_image_mimetype: string; // เช่น image/png

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
