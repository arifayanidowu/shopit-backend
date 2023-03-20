import { Transform } from 'class-transformer';

export class ProductEntity {
  id: string;
  @Transform(({ value }: { value: string }) => value.trim()?.toLowerCase())
  name: string;
  description: string;
  price: number;
  quantity: number;
  gender: 'Male' | 'Female';
  createdById: string;
  image: string;
  size: string;
  @Transform(({ value }: { value: string }) => value.trim()?.toUpperCase())
  sku: string;
  color: string;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}
