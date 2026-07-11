// Purchase Order Validator — Sprint 3.1
import { Request, Response, NextFunction } from 'express';
import { CreatePurchaseOrderSchema } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderSchema } from './dto/update-purchase-order.dto';
import { QueryPurchaseOrderSchema }  from './dto/query-purchase-order.dto';
import { AppError }                  from '../../utils/app-error';

export function validateCreatePurchaseOrder(req: Request, res: Response, next: NextFunction): void {
  const result = CreatePurchaseOrderSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateUpdatePurchaseOrder(req: Request, res: Response, next: NextFunction): void {
  const result = UpdatePurchaseOrderSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryPurchaseOrder(req: Request, res: Response, next: NextFunction): void {
  const result = QueryPurchaseOrderSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}