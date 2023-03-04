import { Transform } from 'class-transformer';

export class CategoryEntity {
  id: string;

  @Transform((params) => params.value.trim()?.toLowerCase())
  name: string;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
