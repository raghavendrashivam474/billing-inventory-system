// Stock Movement Validator — Sprint 3.2
import { Request, Response, NextFunction } from 'express';
import { QueryStockMovementSchema }        from './dto/query-stock-movement.dto';
import { AppError }                        from '../../utils/app-error';

export function validateQueryStockMovement(req: Request, res: Response, next: NextFunction): void {
  const result = QueryStockMovementSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}