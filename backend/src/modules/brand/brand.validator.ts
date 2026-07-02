// Brand Validator — Sprint 2.2
import { Request, Response, NextFunction } from 'express';
import { CreateBrandSchema } from './dto/create-brand.dto';
import { UpdateBrandSchema } from './dto/update-brand.dto';
import { QueryBrandSchema }  from './dto/query-brand.dto';
import { AppError }          from '../../utils/app-error';

export function validateCreateBrand(req: Request, res: Response, next: NextFunction): void {
  const result = CreateBrandSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateUpdateBrand(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateBrandSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryBrand(req: Request, res: Response, next: NextFunction): void {
  const result = QueryBrandSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}