// Customer Validator — Sprint 2.5
import { Request, Response, NextFunction } from 'express';
import { CreateCustomerSchema } from './dto/create-customer.dto';
import { UpdateCustomerSchema } from './dto/update-customer.dto';
import { QueryCustomerSchema }  from './dto/query-customer.dto';
import { AppError }             from '../../utils/app-error';

export function validateCreateCustomer(req: Request, res: Response, next: NextFunction): void {
  const result = CreateCustomerSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateUpdateCustomer(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateCustomerSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryCustomer(req: Request, res: Response, next: NextFunction): void {
  const result = QueryCustomerSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}