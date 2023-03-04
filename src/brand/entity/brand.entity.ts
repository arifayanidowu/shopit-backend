import { Transform } from 'class-transformer';

export class BrandEntity {
  id: string;

  @Transform(({ value }: { value: string }) => value.trim()?.toLowerCase())
  name: string;

  logo?: string;

  constructor(partial: Partial<BrandEntity>) {
    Object.assign(this, partial);
  }
}
