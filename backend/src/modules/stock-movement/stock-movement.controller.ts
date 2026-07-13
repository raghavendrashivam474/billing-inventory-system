// Stock Movement Controller — Sprint 3.2
import { Request, Response }      from 'express';
import { stockMovementService }   from './stock-movement.service';
import { asyncHandler }           from '../../utils/async-handler';
import { HTTP_STATUS }            from '../../constants/api';
import { SMQueryParams }          from './stock-movement.repository';
import { StockMovementType, StockReferenceType } from '@prisma/client';

function parseQuery(raw: Record<string, unknown>): SMQueryParams {
  return {
    page:          Math.max(1, parseInt(String(raw.page  ?? '1'),  10)),
    limit:         Math.min(100, Math.max(1, parseInt(String(raw.limit ?? '20'), 10))),
    sort:          String(raw.sort  ?? 'createdAt').trim(),
    order:         raw.order === 'asc' ? 'asc' : 'desc',
    productId:     raw.productId     ? Number(raw.productId)     : undefined,
    warehouseId:   raw.warehouseId   ? Number(raw.warehouseId)   : undefined,
    type:          raw.type          as StockMovementType  | undefined,
    referenceType: raw.referenceType as StockReferenceType | undefined,
    referenceId:   raw.referenceId   ? Number(raw.referenceId)   : undefined,
    from:          raw.from          as string | undefined,
    to:            raw.to            as string | undefined,
  };
}

export class StockMovementController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const raw    = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parseQuery(raw as Record<string, unknown>);
    const { data, meta } = await stockMovementService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Stock Movements retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const movement = await stockMovementService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Stock Movement retrieved successfully.',
      data:    movement,
    });
  });
}

export const stockMovementController = new StockMovementController();