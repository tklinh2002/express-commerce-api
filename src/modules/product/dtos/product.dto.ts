import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price!: number;

  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock!: number;

  @IsUUID(4, { message: 'Invalid category ID' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId!: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsUUID(4)
  @IsOptional()
  categoryId?: string;
}
