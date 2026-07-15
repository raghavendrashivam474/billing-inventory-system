// Sales Order Controller — Sprint 3.4
import { Request, Response }    from 'express';
import { salesOrderService }    from './sales-order.service';
import { asyncHandler }         from '../../utils/async-handler';
import { HTTP_STATUS }          from '../../constants/api';
import { SOQueryParams }        from './sales-order.repository';
import { SalesOrderStatus }     from '@prisma/client';

function parseQuery(raw: Record<string, unknown>): SOQueryParams {
  return {
    page:        Math.max(1, parseInt(String(raw.page  ?? '1'),  10)),
    limit:       Math.min(100, Math.max(1, parseInt(String(raw.limit ?? '20'), 10))),
    search:      String(raw.search ?? '').trim(),
    sort:        String(raw.sort   ?? 'createdAt').trim(),
    order:       raw.order === 'asc' ? 'asc' : 'desc',
    status:      raw.status      as SalesOrderStatus | undefined,
    customerId:  raw.customerId  ? Number(raw.customerId)  : undefined,
    warehouseId: raw.warehouseId ? Number(raw.warehouseId) : undefined,
  };
}

export class SalesOrderController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const raw    = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parseQuery(raw as Record<string, unknown>);
    const { data, meta } = await salesOrderService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Sales Orders retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    const so = await salesOrderService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Sales Order retrieved successfully.',
      data:    so,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const so = await salesOrderService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Sales Order created successfully.',
      data:    so,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    const so = await salesOrderService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Sales Order updated successfully.',
      data:    so,
    });
  });

  confirm = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    const so = await salesOrderService.confirm(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Sales Order confirmed successfully.',
      data:    so,
    });
  });

  cancel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    const so = await salesOrderService.cancel(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Sales Order cancelled successfully.',
      data:    so,
    });
  });
}

export const salesOrderController = new SalesOrderController();