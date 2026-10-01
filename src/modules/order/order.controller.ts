import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { VnPayService } from './vnpay.service';
import { orderQueue } from '../../jobs/order.queue';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public checkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.checkout(req.user!.id);

      // init VnPayService
      const vnpayService = new VnPayService();

      // get ip user (VNPay requires)
      const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';

      // create payment URL
      const paymentUrl = vnpayService.createPaymentUrl(
        order.id,
        Number(order.totalAmount),
        ipAddr as string,
      );

      // return order and payment link
      res.status(201).json({ status: 'success', data: order, paymentUrl: paymentUrl });
    } catch (error) {
      next(error);
    }
  };

  public getMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.orderService.getMyOrders(req.user!.id);
      res.status(200).json({ status: 'success', data: orders });
    } catch (error) {
      next(error);
    }
  };

  public cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.cancelOrder(req.user!.id, req.params.id as string);
      res.status(200).json({ status: 'success', data: order });
    } catch (error) {
      next(error);
    }
  };

  // Handle VNPay Return URL (Callback after user pays)
  public vnpayReturn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const vnpayService = new VnPayService();
      const isValid = vnpayService.verifyIpnSignature(req.query);

      if (isValid) {
        const responseCode = req.query['vnp_ResponseCode'];
        const orderId = req.query['vnp_TxnRef'] as string;

        if (responseCode === '00') {
          // Success code in VNPay is '00'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await this.orderService.updateOrderStatus(orderId, 'PAID' as any);
          // remove job in queue when order is paid
          await orderQueue.remove(orderId);
          res.send(
            '<h1>Payment Successful!</h1><p>Your order status has been updated to PAID.</p>',
          );
        } else {
          // User cancelled or payment failed
          res.send('<h1>Payment Failed or Cancelled!</h1><p>Please try again.</p>');
        }
      } else {
        res.status(400).send('<h1>Invalid Signature!</h1>');
      }
    } catch (error) {
      next(error);
    }
  };
}
