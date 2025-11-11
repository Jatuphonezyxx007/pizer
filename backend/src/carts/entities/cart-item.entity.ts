import { ProductVariant } from 'src/products/entities/product-variant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  cart_id: number;

  @Column({ type: 'bigint' })
  product_variant_id: number; // <-- สำคัญ: เราเก็บ Variant ID ไม่ใช่ Product ID

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // ราคาต่อชิ้น (ณ ตอนที่เพิ่มเข้าตะกร้า)

  // --- ความสัมพันธ์ ---
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  // เราต้องเชื่อมกับ ProductVariant
  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_variant_id' })
  product_variant: ProductVariant;
}
