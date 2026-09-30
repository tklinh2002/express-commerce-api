import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.create(req.body);
      res.status(201).json({ status: 'success', data: category });
    } catch (error) {
      next(error);
    }
  };

  public findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.categoryService.findAll();
      res.status(200).json({ status: 'success', data: categories });
    } catch (error) {
      next(error);
    }
  };

  public findOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.findOne(req.params.id as string);
      res.status(200).json({ status: 'success', data: category });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.update(req.params.id as string, req.body);
      res.status(200).json({ status: 'success', data: category });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.categoryService.delete(req.params.id as string);
      res.status(204).send(); // 204 means "No Content" (Deleted successfully)
    } catch (error) {
      next(error);
    }
  };
}
