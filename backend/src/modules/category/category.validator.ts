// Category Validator — Sprint 2.2
import { Request, Response, NextFunction } from 'express';
import { CreateCategorySchema } from './dto/create-category.dto';
import { UpdateCategorySchema } from './dto/update-category.dto';
import { QueryCategorySchema }  from './dto/query-category.dto';
import { AppError }             from '../../utils/app-error';

export function validateCreateCategory(req: Request, res: Response, next: NextFunction): void {
  const result = CreateCategorySchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateUpdateCategory(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateCategorySchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryCategory(req: Request, res: Response, next: NextFunction): void {
  const result = QueryCategorySchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}