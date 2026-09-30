import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Category } from '../../category/entities/Category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  // Use decimal type for currency (up to 10 digits, 2 decimal places)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  // Inventory stock count
  @Column({ type: 'int', default: 0 })
  stock!: number;

  // ESTABLISH RELATIONSHIP (Many-to-One)
  // Many products can belong to one Category
  @ManyToOne(() => Category, { onDelete: 'CASCADE' }) // If Category is deleted -> Delete all its Products
  @JoinColumn({ name: 'categoryId' }) // Define the foreign key column name as 'categoryId'
  category!: Category;

  // Explicitly define categoryId column for easier querying and inserting by ID
  // without needing to load the entire Category object
  @Column({ type: 'uuid' })
  categoryId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
