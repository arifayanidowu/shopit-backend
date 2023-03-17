export class ProductEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  gender: 'Male' | 'Female';
  createdById: string;
  image: string;
  size: string;
  sku: string;
  color: string;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}
