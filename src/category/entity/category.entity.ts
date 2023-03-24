import { Category } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CategoryEntity implements Category {
  id: Category['id'];

  @IsString()
  @IsNotEmpty()
  @Transform((params) => params.value.trim()?.toLowerCase())
  name: Category['name'];

  @IsDate()
  createdAt: Category['createdAt'] = new Date();

  @IsDate()
  updatedAt: Category['updatedAt'] = new Date();

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
