import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// DTO for creating a new category
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  @MaxLength(100, { message: 'Category name is too long' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string; // Optional field
}

// DTO for updating an existing category
export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Category name is too long' })
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
