import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductOptionValue } from './product-option-value.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  product_id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  sku: string; // รหัส SKU

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // ราคาของ Variant นี้

  @Column({ type: 'int', default: 0 })
  stock: number; // จำนวนคงคลัง

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // --- ความสัมพันธ์ Many-to-Many กับ OptionValues ---
  @ManyToMany(() => ProductOptionValue, (value) => value.variants, {
    cascade: true,
  })
  @JoinTable({
    name: 'product_variant_values', // <-- นี่คือตารางเชื่อมที่คุณต้องการ!
    joinColumn: { name: 'variant_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'option_value_id', referencedColumnName: 'id' },
  })
  option_values: ProductOptionValue[]; // e.g., [ "Red", "Large" ]
}
