// Storage Location Validator — Sprint 4.1
import { Request, Response, NextFunction } from 'express';
import { CreateStorageLocationSchema } from './dto/create-storage-location.dto';
import { UpdateStorageLocationSchema } from './dto/update-storage-location.dto';
import { QueryStorageLocationSchema }  from './dto/query-storage-location.dto';
import { AppError }                    from '../../utils/app-error';

export function validateCreateStorageLocation(req: Request, res: Response, next: NextFunction): void {
  const result = CreateStorageLocationSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateUpdateStorageLocation(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateStorageLocationSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryStorageLocation(req: Request, res: Response, next: NextFunction): void {
  const result = QueryStorageLocationSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}