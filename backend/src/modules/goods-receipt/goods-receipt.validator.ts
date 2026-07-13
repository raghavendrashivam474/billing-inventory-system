// Goods Receipt Validator — Sprint 3.2
import { Request, Response, NextFunction } from 'express';
import { CreateGoodsReceiptSchema }        from './dto/create-goods-receipt.dto';
import { QueryGoodsReceiptSchema }         from './dto/query-goods-receipt.dto';
import { AppError }                        from '../../utils/app-error';

export function validateCreateGoodsReceipt(req: Request, res: Response, next: NextFunction): void {
  const result = CreateGoodsReceiptSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }

  // Duplicate purchaseOrderItemId check
  const ids    = result.data.items.map((i) => i.purchaseOrderItemId);
  const unique = new Set(ids);
  if (unique.size !== ids.length) {
    return next(AppError.badRequest('Duplicate purchase order item IDs are not allowed in a goods receipt.'));
  }

  req.body = result.data;
  next();
}

export function validateQueryGoodsReceipt(req: Request, res: Response, next: NextFunction): void {
  const result = QueryGoodsReceiptSchema.safeParse(req.query);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(', ');
    return next(AppError.badRequest(message));
  }
  (req as Request & { parsedQuery: unknown }).parsedQuery = result.data;
  next();
}