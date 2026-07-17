// Invoice Validator — Sprint 3.6
import { Request, Response, NextFunction } from 'express';
import { CreateInvoiceSchema } from './dto/create-invoice.dto';
import { UpdateInvoiceSchema } from './dto/update-invoice.dto';
import { QueryInvoiceSchema }  from './dto/query-invoice.dto';
import { AppError }            from '../../utils/app-error';

export function validateCreateInvoice(req: Request, res: Response, next: NextFunction): void {
  const result = CreateInvoiceSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateUpdateInvoice(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateInvoiceSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  req.body = result.data;
  next();
}

export function validateQueryInvoice(req: Request, res: Response, next: NextFunction): void {
  const result = QueryInvoiceSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}