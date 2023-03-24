import { Product } from '@prisma/client';
import { Transform } from 'class-transformer';

export class ProductEntity implements Product {
  id: Product['id'];
  name: Product['name'];
  description: Product['description'];
  price: Product['price'];
  newPrice: Product['newPrice'];
  isDiscounted: Product['isDiscounted'];
  discount: Product['discount'];
  image: Product['image'];
  quantity: Product['quantity'];
  createdById: Product['createdById'];
  brandId: Product['brandId'];
  categoryId: Product['categoryId'];
  gender: Product['gender'];
  createdAt: Product['createdAt'];
  updatedAt: Product['updatedAt'];
  isPublished: Product['isPublished'];
  sizes: Product['sizes'];
  size: Product['size'];
  status: Product['status'];
  orderId: Product['orderId'];
  @Transform(({ value }: { value: string }) =>
    value.trim()?.toLocaleUpperCase(),
  )
  sku: Product['sku'];
  color: Product['color'];
  type: Product['type'];

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}
