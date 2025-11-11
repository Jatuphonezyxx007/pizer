import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductOption } from './entities/product-option.entity';
import { ProductOptionValue } from './entities/product-option-value.entity';
import { ProductVariant } from './entities/product-variant.entity';
// ...
@Module({
  imports: [
    TypeOrmModule.forFeature([
      // <-- เพิ่ม
      Product,
      ProductImage,
      ProductOption,
      ProductOptionValue,
      ProductVariant,
    ]),
  ],
  // ...
})
export class ProductsModule {}
