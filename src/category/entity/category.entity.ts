import { Category } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryEntity implements Category {
  id: Category['id'];

  @IsString()
  @IsNotEmpty()
  @Transform((params) => params.value.trim()?.toLowerCase())
  name: Category['name'];

  createdAt: Category['createdAt'];

  updatedAt: Category['updatedAt'];

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
