import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Category } from './entities/Category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/category.dto';
import { AppError } from '../../core/exceptions/AppError';

export class CategoryService {
  private categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  // CREATE
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new AppError('Category with this name already exists', 400);
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  // READ ALL
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  // READ ONE
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  // UPDATE
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id); // Re-use findOne to check existence

    // If updating name, ensure it doesn't conflict with another category
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });
      if (existingCategory) {
        throw new AppError('Category with this name already exists', 400);
      }
    }

    // Merge updates into the existing entity
    const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto);
    return await this.categoryRepository.save(updatedCategory);
  }

  // DELETE
  async delete(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
