// Warehouse Validator — Sprint 2.6
import { Request, Response, NextFunction } from 'express';
import { CreateWarehouseSchema } from './dto/create-warehouse.dto';
import { UpdateWarehouseSchema } from './dto/update-warehouse.dto';
import { QueryWarehouseSchema }  from './dto/query-warehouse.dto';
import { AppError }              from '../../utils/app-error';

export function validateCreateWarehouse(req: Request, res: Response, next: NextFunction): void {
  const result = CreateWarehouseSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateUpdateWarehouse(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateWarehouseSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryWarehouse(req: Request, res: Response, next: NextFunction): void {
  const result = QueryWarehouseSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}