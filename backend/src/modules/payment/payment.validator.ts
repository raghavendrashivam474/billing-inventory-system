// Payment Validator — Sprint 3.7
import { Request, Response, NextFunction } from 'express';
import { CreatePaymentSchema } from './dto/create-payment.dto';
import { QueryPaymentSchema }  from './dto/query-payment.dto';
import { AppError }            from '../../utils/app-error';

export function validateCreatePayment(req: Request, res: Response, next: NextFunction): void {
  const result = CreatePaymentSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryPayment(req: Request, res: Response, next: NextFunction): void {
  const result = QueryPaymentSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}