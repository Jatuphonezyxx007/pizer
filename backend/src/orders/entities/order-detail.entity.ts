import { ProductVariant } from 'src/products/entities/product-variant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  order_id: number;

  @Column({ type: 'bigint' })
  product_variant_id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // ราคาต่อชิ้น (ณ ตอนที่ "ซื้อ")

  // --- ความสัมพันธ์ ---
  @ManyToOne(() => Order, (order) => order.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => ProductVariant, { onDelete: 'SET NULL' }) // SET NULL ถ้า Variant ถูกลบ
  @JoinColumn({ name: 'product_variant_id' })
  product_variant: ProductVariant;
}
