import { Product } from 'src/products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  // สำหรับเก็บหมวดหมู่แม่ (ถ้าเป็น null คือหมวดหมู่หลัก)
  @Column({ type: 'bigint', nullable: true })
  parent_id: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  // --- ความสัมพันธ์ ---

  // 1. หมวดหมู่ย่อย (ลูก)
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  // 2. หมวดหมู่หลัก (แม่)
  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  // 3. สินค้าในหมวดหมู่นี้
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
