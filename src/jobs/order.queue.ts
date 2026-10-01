import { Queue, Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';

export const orderQueue = new Queue('OrderQueue', {
  connection: redisConnection,
});

export const orderWorker = new Worker(
  'OrderQueue',
  async (job: Job) => {
    // Dynamically import OrderService to completely avoid Circular Dependency
    const { OrderService } = await import('../modules/order/order.service');
    const orderService = new OrderService();

    if (job.name === 'cancelUnpaidOrder') {
      const { userId, orderId } = job.data;
      console.log(`\n🕒 [OrderWorker] Checking payment status for Order ${orderId}...`);

      try {
        await orderService.cancelOrder(userId, orderId);
        console.log(
          `❌ [OrderWorker] Order ${orderId} was unpaid for 15 mins. Cancelled and stock restored!\n`,
        );
      } catch (error: unknown) {
        console.log(`✅ [OrderWorker] Order ${orderId} is safe. (Message: ${(error as Error).message})\n`);
      }
    }
  },
  { connection: redisConnection },
);
