// Stock Adjustment Validator — Sprint 3.3
import { Request, Response, NextFunction } from 'express';
import { CreateStockAdjustmentSchema }     from './dto/create-stock-adjustment.dto';
import { QueryStockAdjustmentSchema }      from './dto/query-stock-adjustment.dto';
import { AppError }                        from '../../utils/app-error';

export function validateCreateStockAdjustment(req: Request, res: Response, next: NextFunction): void {
  const result = CreateStockAdjustmentSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryStockAdjustment(req: Request, res: Response, next: NextFunction): void {
  const result = QueryStockAdjustmentSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}