import { Brand } from '@prisma/client';
import { Transform } from 'class-transformer';

export class BrandEntity implements Brand {
  id: string;

  @Transform(({ value }: { value: string }) => value.trim()?.toLowerCase())
  name: string;

  logo: string;

  createdAt: Date;

  updatedAt: Date = new Date();

  constructor(partial: Partial<BrandEntity>) {
    Object.assign(this, partial);
  }
}
