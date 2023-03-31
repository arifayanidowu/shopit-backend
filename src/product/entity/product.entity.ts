import { Gender, Product, Status } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ProductEntity implements Product {
  @Exclude()
  id: string;

  name: string;

  description: string;

  price: number;

  newPrice: number | null;
  isDiscounted: boolean;
  discount: number | null;
  image: string;
  quantity: number;
  createdById: string | null;
  brandId: string | null;
  categoryId: string | null;
  gender: Gender | null;
  createdAt: Date;
  updatedAt: Date;
  size: string | null;
  status: Status | null;
  orderId: string | null;
  sku: string | null;
  color: string | null;
  type: string | null;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}
