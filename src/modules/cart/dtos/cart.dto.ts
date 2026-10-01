import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class AddToCartDto {
  // Validate that the provided productId is a valid UUID
  @IsUUID(4, { message: 'Invalid product ID format' })
  @IsNotEmpty({ message: 'Product ID is required' })
  productId!: string;

  // Ensure quantity is at least 1
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity!: number;
}
