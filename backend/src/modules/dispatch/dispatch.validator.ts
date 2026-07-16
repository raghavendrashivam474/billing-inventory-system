// Dispatch Validator — Sprint 3.5
import { Request, Response, NextFunction } from 'express';
import { CreateDispatchSchema }            from './dto/create-dispatch.dto';
import { QueryDispatchSchema }             from './dto/query-dispatch.dto';
import { AppError }                        from '../../utils/app-error';

export function validateCreateDispatch(req: Request, res: Response, next: NextFunction): void {
  const result = CreateDispatchSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }

  // Duplicate salesOrderItemId check
  const ids    = result.data.items.map((i) => i.salesOrderItemId);
  const unique = new Set(ids);
  if (unique.size !== ids.length) {
    return next(AppError.badRequest('Duplicate Sales Order Item IDs are not allowed in a dispatch.'));
  }

  req.body = result.data;
  next();
}

export function validateQueryDispatch(req: Request, res: Response, next: NextFunction): void {
  const result = QueryDispatchSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}