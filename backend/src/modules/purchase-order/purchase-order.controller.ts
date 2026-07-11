// Purchase Order Controller — Sprint 3.1
import { Request, Response }  from 'express';
import { purchaseOrderService } from './purchase-order.service';
import { asyncHandler }        from '../../utils/async-handler';
import { HTTP_STATUS }         from '../../constants/api';
import { POQueryParams }       from './purchase-order.repository';
import { PurchaseOrderStatus } from '@prisma/client';

function parseQueryParams(raw: Record<string, unknown>): POQueryParams {
  return {
    page:        Math.max(1, parseInt(String(raw.page  ?? '1'),  10)),
    limit:       Math.min(100, Math.max(1, parseInt(String(raw.limit ?? '20'), 10))),
    search:      String(raw.search ?? '').trim(),
    sort:        String(raw.sort   ?? 'createdAt').trim(),
    order:       raw.order === 'asc' ? 'asc' : 'desc',
    status:      raw.status as PurchaseOrderStatus | undefined,
    supplierId:  raw.supplierId  ? Number(raw.supplierId)  : undefined,
    warehouseId: raw.warehouseId ? Number(raw.warehouseId) : undefined,
    fromDate:    raw.fromDate as string | undefined,
    toDate:      raw.toDate   as string | undefined,
  };
}

export class PurchaseOrderController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const raw    = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parseQueryParams(raw as Record<string, unknown>);
    const { data, meta } = await purchaseOrderService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Purchase Orders retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    const po = await purchaseOrderService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Purchase Order retrieved successfully.',
      data:    po,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const po = await purchaseOrderService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Purchase Order created successfully.',
      data:    po,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    const po = await purchaseOrderService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Purchase Order updated successfully.',
      data:    po,
    });
  });

  confirm = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    const po = await purchaseOrderService.confirm(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Purchase Order confirmed successfully.',
      data:    po,
    });
  });

  cancel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    const po = await purchaseOrderService.cancel(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Purchase Order cancelled successfully.',
      data:    po,
    });
  });
}

export const purchaseOrderController = new PurchaseOrderController();