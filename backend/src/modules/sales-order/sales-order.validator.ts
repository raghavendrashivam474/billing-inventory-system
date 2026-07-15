// Sales Order Validator — Sprint 3.4
import { Request, Response, NextFunction } from 'express';
import { CreateSalesOrderSchema }          from './dto/create-sales-order.dto';
import { UpdateSalesOrderSchema }          from './dto/update-sales-order.dto';
import { QuerySalesOrderSchema }           from './dto/query-sales-order.dto';
import { AppError }                        from '../../utils/app-error';

export function validateCreateSalesOrder(req: Request, res: Response, next: NextFunction): void {
  const result = CreateSalesOrderSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }

  // Duplicate productId check
  const ids    = result.data.items.map((i) => i.productId);
  const unique = new Set(ids);
  if (unique.size !== ids.length) {
    return next(AppError.badRequest('Duplicate Product IDs are not allowed in a Sales Order.'));
  }

  req.body = result.data;
  next();
}

export function validateUpdateSalesOrder(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateSalesOrderSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }

  if (result.data.items) {
    const ids    = result.data.items.map((i) => i.productId);
    const unique = new Set(ids);
    if (unique.size !== ids.length) {
      return next(AppError.badRequest('Duplicate Product IDs are not allowed in a Sales Order.'));
    }
  }

  req.body = result.data;
  next();
}

export function validateQuerySalesOrder(req: Request, res: Response, next: NextFunction): void {
  const result = QuerySalesOrderSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}