import {
  Admin,
  Role,
  Product,
  Gender,
  Status,
  Brand,
  Category,
} from '@prisma/client';

export class AdminClass implements Admin {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  active: boolean;
  validateToken: string | null;
  role: Role;
  username: string | null;
  createdAt: Date;
  updatedAt: Date;
  avatar: string | null;
}

export class ProductClass implements Product {
  id: string;
  name: string;
  description: string;
  price: number;
  newPrice: number | null;
  isDiscounted: boolean;
  discount: number | null;
  image: string;
  quantity: number;
  createdById: string;
  brandId: string;
  categoryId: string;
  gender: Gender | null;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  size: string | null;
  status: Status;
  orderId: string | null;
  sku: string | null;
  color: string | null;
  type: string | null;
}

export class BrandClass implements Brand {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  logo: string | null;
}

export class CategoryClass implements Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
