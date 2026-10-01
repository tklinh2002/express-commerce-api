import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Cart } from './entities/Cart.entity';
import { CartItem } from './entities/CartItem.entity';
import { Product } from '../product/entities/Product.entity';
import { AddToCartDto } from './dtos/cart.dto';
import { AppError } from '../../core/exceptions/AppError';

export class CartService {
  private cartRepository: Repository<Cart>;
  private cartItemRepository: Repository<CartItem>;
  private productRepository: Repository<Product>;

  constructor() {
    this.cartRepository = AppDataSource.getRepository(Cart);
    this.cartItemRepository = AppDataSource.getRepository(CartItem);
    this.productRepository = AppDataSource.getRepository(Product);
  }

  // HELPER: Fetch the user's cart. If it doesn't exist, create an empty one automatically.
  private async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: {
        items: {
          product: true,
        },
      }, // Eager load cart items and their product details
    });

    if (!cart) {
      // Create a new cart if the user doesn't have one yet
      cart = this.cartRepository.create({ userId });
      await this.cartRepository.save(cart);

      // Fetch it again to ensure relations are properly structured (empty items array)
      cart = (await this.cartRepository.findOne({
        where: { id: cart.id },
        relations: {
          items: {
            product: true,
          },
        },
      })) as Cart;
    }

    return cart;
  }

  // 1. GET CART
  async getCart(userId: string): Promise<Cart> {
    return await this.getOrCreateCart(userId);
  }

  // 2. ADD TO CART
  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = addToCartDto;

    // Check if the product exists and has enough stock
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    if (product.stock < quantity) {
      throw new AppError('Not enough stock available', 400);
    }

    const cart = await this.getOrCreateCart(userId);

    // Check if the product is already in the cart
    const existingItem = cart.items?.find((item) => item.productId === productId);

    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += quantity;

      // Double check stock limit after adding
      if (existingItem.quantity > product.stock) {
        throw new AppError('Requested quantity exceeds available stock', 400);
      }

      await this.cartItemRepository.save(existingItem);
    } else {
      // Create a new cart item
      const newItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: product.id,
        quantity,
      });
      await this.cartItemRepository.save(newItem);
    }

    // Return the fresh updated cart
    return await this.getOrCreateCart(userId);
  }

  // 3. REMOVE ITEM FROM CART
  async removeItem(userId: string, cartItemId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    // Ensure the item belongs to THIS specific user's cart before deleting
    const itemToRemove = await this.cartItemRepository.findOne({
      where: { id: cartItemId, cartId: cart.id },
    });

    if (!itemToRemove) {
      throw new AppError('Cart item not found in your cart', 404);
    }

    await this.cartItemRepository.remove(itemToRemove);

    return await this.getOrCreateCart(userId);
  }
}
