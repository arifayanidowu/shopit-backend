import { Brand } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class BrandEntity implements Brand {
  id: Brand['id'];

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim()?.toLowerCase())
  name: Brand['name'];

  logo: Brand['logo'];

  createdAt: Brand['createdAt'];

  updatedAt: Brand['updatedAt'];

  constructor(partial: Partial<BrandEntity>) {
    Object.assign(this, partial);
  }
}
