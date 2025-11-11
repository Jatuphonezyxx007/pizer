import { Address } from 'src/users/entities/address.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { OrderDetail } from './order-detail.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Shipment } from 'src/shipments/entities/shipment.entity';
import { Refund } from 'src/refunds/entities/refund.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';

// Enum สำหรับสถานะคำสั่งซื้อ
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  user_id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number; // ยอดรวมสุทธิ

  @Column({ type: 'bigint', nullable: true })
  shipping_address_id: number;

  @Column({ type: 'bigint', nullable: true })
  billing_address_id: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  // --- ความสัมพันธ์ ---
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Address, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'shipping_address_id' })
  shipping_address: Address;

  @ManyToOne(() => Address, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'billing_address_id' })
  billing_address: Address;

  @OneToMany(() => OrderDetail, (detail) => detail.order, { cascade: true })
  details: OrderDetail[];

  @OneToMany(() => Payment, (payment) => payment.order, { cascade: true })
  payments: Payment[];

  @OneToMany(() => Shipment, (shipment) => shipment.order, { cascade: true })
  shipments: Shipment[];

  @OneToMany(() => Refund, (refund) => refund.order)
  refunds: Refund[];

  @OneToMany(() => Invoice, (invoice) => invoice.order)
  invoices: Invoice[];
}
