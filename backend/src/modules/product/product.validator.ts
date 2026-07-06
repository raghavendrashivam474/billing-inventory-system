// Product Validator — Sprint 2.4
import { Request, Response, NextFunction } from 'express';
import { CreateProductSchema } from './dto/create-product.dto';
import { UpdateProductSchema } from './dto/update-product.dto';
import { QueryProductSchema }  from './dto/query-product.dto';
import { AppError }            from '../../utils/app-error';

export function validateCreateProduct(req: Request, res: Response, next: NextFunction): void {
  const result = CreateProductSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateUpdateProduct(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateProductSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryProduct(req: Request, res: Response, next: NextFunction): void {
  const result = QueryProductSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}