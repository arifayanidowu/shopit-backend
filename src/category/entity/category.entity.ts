import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryEntity {
  id: string;

  @IsString()
  @IsNotEmpty()
  @Transform((params) => params.value.trim()?.toLowerCase())
  name: string;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
