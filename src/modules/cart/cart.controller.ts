import { Request, Response, NextFunction } from 'express';
import { CartService } from './cart.service';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  public getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // req.user is guaranteed to exist because of jwtAuthMiddleware
      const cart = await this.cartService.getCart(req.user!.id);
      res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
      next(error);
    }
  };

  public addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.cartService.addToCart(req.user!.id, req.body);
      res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
      next(error);
    }
  };

  public removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.cartService.removeItem(req.user!.id, req.params.itemId as string);
      res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
      next(error);
    }
  };
}
