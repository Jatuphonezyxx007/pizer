import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DiscountType {
  FIXED = 'fixed', // ส่วนลดแบบจำนวนเงินคงที่ (เช่น 100 บาท)
  PERCENTAGE = 'percentage', // ส่วนลดแบบเปอร์เซ็นต์ (เช่น 10%)
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: DiscountType })
  discount_type: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount_value: number;

  @Column({ type: 'datetime', nullable: true })
  start_date: Date;

  @Column({ type: 'datetime' })
  expiry_date: Date;

  @Column({ type: 'int', default: 1 })
  usage_limit: number; // จำกัดจำนวนครั้งที่ใช้ได้ทั้งหมด

  @Column({ type: 'int', default: 0 })
  usage_count: number; // จำนวนครั้งที่ถูกใช้ไปแล้ว

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
