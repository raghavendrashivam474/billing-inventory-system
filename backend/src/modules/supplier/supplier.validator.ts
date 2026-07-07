// Supplier Validator — Sprint 2.5
import { Request, Response, NextFunction } from 'express';
import { CreateSupplierSchema } from './dto/create-supplier.dto';
import { UpdateSupplierSchema } from './dto/update-supplier.dto';
import { QuerySupplierSchema }  from './dto/query-supplier.dto';
import { AppError }             from '../../utils/app-error';

export function validateCreateSupplier(req: Request, res: Response, next: NextFunction): void {
  const result = CreateSupplierSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateUpdateSupplier(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateSupplierSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQuerySupplier(req: Request, res: Response, next: NextFunction): void {
  const result = QuerySupplierSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}