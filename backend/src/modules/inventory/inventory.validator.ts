// Inventory Validator — Sprint 3.2
import { Request, Response, NextFunction } from 'express';
import { QueryInventorySchema }            from './dto/query-inventory.dto';
import { AppError }                        from '../../utils/app-error';

export function validateQueryInventory(req: Request, res: Response, next: NextFunction): void {
  const result = QueryInventorySchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}