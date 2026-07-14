// Stock Adjustment Controller — Sprint 3.3
import { Request, Response }         from 'express';
import { stockAdjustmentService }    from './stock-adjustment.service';
import { asyncHandler }              from '../../utils/async-handler';
import { HTTP_STATUS }               from '../../constants/api';
import { SAQueryParams }             from './stock-adjustment.repository';
import { StockAdjustmentType, StockAdjustmentReason } from '@prisma/client';

function parseQuery(raw: Record<string, unknown>): SAQueryParams {
  return {
    page:           Math.max(1, parseInt(String(raw.page  ?? '1'),  10)),
    limit:          Math.min(100, Math.max(1, parseInt(String(raw.limit ?? '20'), 10))),
    search:         String(raw.search ?? '').trim(),
    sort:           String(raw.sort   ?? 'createdAt').trim(),
    order:          raw.order === 'asc' ? 'asc' : 'desc',
    productId:      raw.productId   ? Number(raw.productId)   : undefined,
    warehouseId:    raw.warehouseId ? Number(raw.warehouseId) : undefined,
    adjustmentType: raw.adjustmentType as StockAdjustmentType   | undefined,
    reason:         raw.reason         as StockAdjustmentReason | undefined,
    fromDate:       raw.fromDate as string | undefined,
    toDate:         raw.toDate   as string | undefined,
  };
}

export class StockAdjustmentController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const raw    = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parseQuery(raw as Record<string, unknown>);
    const { data, meta } = await stockAdjustmentService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Stock Adjustments retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id         = parseInt(String(req.params.id), 10);
    const adjustment = await stockAdjustmentService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Stock Adjustment retrieved successfully.',
      data:    adjustment,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adjustment = await stockAdjustmentService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Stock Adjustment posted successfully.',
      data:    adjustment,
    });
  });
}

export const stockAdjustmentController = new StockAdjustmentController();