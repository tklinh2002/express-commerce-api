import 'reflect-metadata';
import 'dotenv/config';
import { AppDataSource } from './config/data-source';
import { User, UserRole } from './modules/auth/entities/User.entity';
import { Category } from './modules/category/entities/Category.entity';
import { Product } from './modules/product/entities/Product.entity';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    console.log('⏳ Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connected!');

    const userRepository = AppDataSource.getRepository(User);
    const categoryRepository = AppDataSource.getRepository(Category);
    const productRepository = AppDataSource.getRepository(Product);

    // 1. Clear old data (Delete in order to avoid Foreign Key constraint errors)
    console.log('🧹 Clearing old data...');
    await productRepository.createQueryBuilder().delete().execute();
    await categoryRepository.createQueryBuilder().delete().execute();
    await userRepository.createQueryBuilder().delete().execute();

    // 2. Create sample users
    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = userRepository.create({
      email: 'admin@test.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    const customer = userRepository.create({
      email: 'customer@test.com',
      password: hashedPassword,
      role: UserRole.USER, // Default is USER
    });

    await userRepository.save([admin, customer]);

    // 3. Create sample categories
    console.log('📁 Creating categories...');
    const electronics = categoryRepository.create({
      name: 'Electronics',
      description: 'Gadgets and devices',
    });
    const clothing = categoryRepository.create({ name: 'Clothing', description: 'Fashion items' });

    await categoryRepository.save([electronics, clothing]);

    // 4. Create sample products (Attached to Category)
    console.log('📱 Creating products...');
    const products = [
      productRepository.create({
        name: 'iPhone 15 Pro Max',
        description: 'Latest Apple smartphone',
        price: 29990000,
        stock: 50,
        categoryId: electronics.id,
      }),
      productRepository.create({
        name: 'MacBook Pro M3',
        description: 'Powerful laptop for professionals',
        price: 49990000,
        stock: 20,
        categoryId: electronics.id,
      }),
      productRepository.create({
        name: 'Nike Air Force 1',
        description: 'Classic white sneakers',
        price: 2500000,
        stock: 100,
        categoryId: clothing.id,
      }),
    ];

    await productRepository.save(products);

    console.log('🎉 Seeding completed successfully!');
    console.log('\n--- ACCOUNTS FOR TESTING ---');
    console.log('Customer Email: customer@test.com');
    console.log('Admin Email: admin@test.com');
    console.log('Password for both: password123\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();
