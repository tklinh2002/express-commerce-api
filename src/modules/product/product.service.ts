import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Product } from './entities/Product.entity';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { AppError } from '../../core/exceptions/AppError';

export class ProductService {
  private productRepository: Repository<Product>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

  // CREATE
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  // READ ALL (With Pagination, Filtering, and Searching)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAll(query: any): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const { search, categoryId, page = 1, limit = 10 } = query;
    
    // Initialize QueryBuilder
    const qb = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category'); // Eager load the category

    // 1. Search by name (Case-insensitive ILIKE for Postgres)
    if (search) {
      qb.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }

    // 2. Filter by category
    if (categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    // 3. Pagination logic
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    
    qb.skip((pageNumber - 1) * limitNumber);
    qb.take(limitNumber);
    qb.orderBy('product.createdAt', 'DESC');

    // Execute query to get both data array and total count
    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  // READ ONE
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations:{
        category:true // Fetch associated category
      } 
    });
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  // UPDATE
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const updatedProduct = this.productRepository.merge(product, updateProductDto);
    return await this.productRepository.save(updatedProduct);
  }

  // DELETE
  async delete(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
