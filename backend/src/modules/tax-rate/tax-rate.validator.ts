// Tax Rate Validator — Sprint 2.3
import { Request, Response, NextFunction } from 'express';
import { CreateTaxRateSchema } from './dto/create-tax-rate.dto';
import { UpdateTaxRateSchema } from './dto/update-tax-rate.dto';
import { QueryTaxRateSchema }  from './dto/query-tax-rate.dto';
import { AppError }            from '../../utils/app-error';

export function validateCreateTaxRate(req: Request, res: Response, next: NextFunction): void {
  const result = CreateTaxRateSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateUpdateTaxRate(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateTaxRateSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryTaxRate(req: Request, res: Response, next: NextFunction): void {
  const result = QueryTaxRateSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}