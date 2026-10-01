import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public checkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.checkout(req.user!.id);
      res.status(201).json({ status: 'success', data: order });
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
}
