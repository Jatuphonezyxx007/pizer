import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum NotificationType {
  ORDER = 'order', // แจ้งเตือนเกี่ยวกับคำสั่งซื้อ
  PROMOTION = 'promotion', // แจ้งเตือนโปรโมชั่น
  SYSTEM = 'system', // แจ้งเตือนจากระบบ
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number; // ผู้รับการแจ้งเตือน

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  // --- ความสัมพันธ์ ---
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
