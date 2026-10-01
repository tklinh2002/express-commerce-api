import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Order, OrderStatus } from './entities/Order.entity';
import { OrderItem } from './entities/OrderItem.entity';
import { Cart } from '../cart/entities/Cart.entity';
import { CartItem } from '../cart/entities/CartItem.entity';
import { Product } from '../product/entities/Product.entity';
import { AppError } from '../../core/exceptions/AppError';
import { emailQueue } from '../../jobs/email.queue';
import { orderQueue } from '../../jobs/order.queue';

export class OrderService {
  private orderRepository: Repository<Order>;
  private cartRepository: Repository<Cart>;

  constructor() {
    this.orderRepository = AppDataSource.getRepository(Order);
    this.cartRepository = AppDataSource.getRepository(Cart);
  }

  // 1. CREATE ORDER FROM CART (Using Database Transaction)
  async checkout(userId: string): Promise<Order> {
    // A. Fetch the user's cart
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: {
        items: {
          product: true,
        },
        user: true,
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new AppError('Your cart is empty', 400);
    }

    // B. Initialize QueryRunner for Transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // Start the transaction block

    try {
      let totalAmount = 0;
      const orderItemsToSave: OrderItem[] = [];

      // C. Process each item in the cart
      for (const cartItem of cart.items) {
        const product = cartItem.product;

        // 1. Check stock availability
        if (product.stock < cartItem.quantity) {
          throw new AppError(`Not enough stock for product: ${product.name}`, 400);
        }

        // 2. Deduct stock safely inside transaction
        product.stock -= cartItem.quantity;
        await queryRunner.manager.save(Product, product);

        // 3. Calculate total
        const lineTotal = Number(product.price) * cartItem.quantity;
        totalAmount += lineTotal;

        // 4. Prepare OrderItem (capture current price)
        const orderItem = new OrderItem();
        orderItem.productId = product.id;
        orderItem.quantity = cartItem.quantity;
        orderItem.price = product.price;
        orderItemsToSave.push(orderItem);
      }

      // D. Create the Order
      const newOrder = new Order();
      newOrder.userId = userId;
      newOrder.totalAmount = totalAmount;
      newOrder.status = OrderStatus.PENDING;
      newOrder.items = orderItemsToSave; // TypeORM will cascade save these items

      const savedOrder = await queryRunner.manager.save(Order, newOrder);

      // E. Clear the cart (delete cart items)
      await queryRunner.manager.remove(CartItem, cart.items);

      // F. Commit the transaction (EVERYTHING SUCCEEDS)
      await queryRunner.commitTransaction();

      await emailQueue.add('sendOrderConfirmation', {
        to: cart.user.email,
        subject: `Order Confirmation #${savedOrder.id}`,
        totalAmount: savedOrder.totalAmount,
      });

      const cancelDelayMs = parseInt(process.env.ORDER_CANCEL_DELAY_MS || '900000', 10); // Default 15 minutes
      await orderQueue.add(
        'cancelUnpaidOrder',
        { userId, orderId: savedOrder.id },
        { delay: cancelDelayMs, jobId: savedOrder.id }, // Use env variable
      );

      return savedOrder;
    } catch (error) {
      // G. Rollback the transaction on ANY error (NOTHING SAVED, STOCK REVERTED)
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // H. Release the connection back to the pool to prevent memory leaks
      await queryRunner.release();
    }
  }

  // 2. GET USER'S ORDER HISTORY
  async getMyOrders(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: {
        items: {
          product: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  // 3. CANCEL ORDER (Restore stock using Transaction)
  async cancelOrder(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new AppError('Only PENDING orders can be cancelled', 400);
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Change order status to CANCELLED
      order.status = OrderStatus.CANCELLED;
      await queryRunner.manager.save(Order, order);

      // 2. Restore stock for each product in the order
      for (const item of order.items) {
        const product = item.product;
        product.stock += item.quantity;
        await queryRunner.manager.save(Product, product);
      }

      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 4. UPDATE ORDER STATUS (For VNPay IPN/Return)
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    await this.orderRepository.update(orderId, { status });
  }
}
