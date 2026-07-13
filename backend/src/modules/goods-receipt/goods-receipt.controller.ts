// Goods Receipt Controller — Sprint 3.2
import { Request, Response }      from 'express';
import { goodsReceiptService }    from './goods-receipt.service';
import { asyncHandler }           from '../../utils/async-handler';
import { HTTP_STATUS }            from '../../constants/api';
import { GRNQueryParams }         from './goods-receipt.repository';

function parseQuery(raw: Record<string, unknown>): GRNQueryParams {
  return {
    page:            Math.max(1, parseInt(String(raw.page  ?? '1'),  10)),
    limit:           Math.min(100, Math.max(1, parseInt(String(raw.limit ?? '20'), 10))),
    search:          String(raw.search ?? '').trim(),
    sort:            String(raw.sort   ?? 'createdAt').trim(),
    order:           raw.order === 'asc' ? 'asc' : 'desc',
    purchaseOrderId: raw.purchaseOrderId ? Number(raw.purchaseOrderId) : undefined,
    warehouseId:     raw.warehouseId     ? Number(raw.warehouseId)     : undefined,
  };
}

export class GoodsReceiptController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const raw    = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parseQuery(raw as Record<string, unknown>);
    const { data, meta } = await goodsReceiptService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Goods Receipts retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id  = parseInt(String(req.params.id), 10);
    const grn = await goodsReceiptService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Goods Receipt retrieved successfully.',
      data:    grn,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const grn = await goodsReceiptService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Goods Receipt created successfully.',
      data:    grn,
    });
  });
}

export const goodsReceiptController = new GoodsReceiptController();