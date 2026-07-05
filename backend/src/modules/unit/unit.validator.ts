// Unit Validator — Sprint 2.3
import { Request, Response, NextFunction } from 'express';
import { CreateUnitSchema } from './dto/create-unit.dto';
import { UpdateUnitSchema } from './dto/update-unit.dto';
import { QueryUnitSchema }  from './dto/query-unit.dto';
import { AppError }         from '../../utils/app-error';

export function validateCreateUnit(req: Request, res: Response, next: NextFunction): void {
  const result = CreateUnitSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateUpdateUnit(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateUnitSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryUnit(req: Request, res: Response, next: NextFunction): void {
  const result = QueryUnitSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}