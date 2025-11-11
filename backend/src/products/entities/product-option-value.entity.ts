import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { ProductOption } from './product-option.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('product_option_values')
export class ProductOptionValue {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  option_id: number;

  @Column({ type: 'varchar', length: 100 })
  value: string; // e.g., "Red", "Large"

  @ManyToOne(() => ProductOption, (option) => option.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_id' })
  option: ProductOption;

  // ความสัมพันธ์กับ Variants (จะกำหนดใน variant.entity)
  @ManyToMany(() => ProductVariant, (variant) => variant.option_values)
  variants: ProductVariant[];
}
