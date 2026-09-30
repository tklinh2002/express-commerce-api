import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json({ status: 'success', data: product });
    } catch (error) {
      next(error);
    }
  };

  public findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Pass the query string from the request URL to the service
      const result = await this.productService.findAll(req.query);
      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  };

  public findOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.findOne(req.params.id as string);
      res.status(200).json({ status: 'success', data: product });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.update(req.params.id as string, req.body);
      res.status(200).json({ status: 'success', data: product });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.productService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
