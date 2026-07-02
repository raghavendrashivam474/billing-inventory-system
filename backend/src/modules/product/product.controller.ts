// Product Controller — Sprint 2.1 Placeholder
import { Request, Response } from 'express';
import { HTTP_STATUS }       from '../../constants/api';

export class ProductController {
  placeholder(req: Request, res: Response): void {
    res.status(HTTP_STATUS.OK).json({ message: 'Coming soon.' });
  }
}

export const Controller = new ProductController();