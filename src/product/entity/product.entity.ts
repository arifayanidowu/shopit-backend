export class ProductEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  createdById: string;
  image: string;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}
