// Dispatch Controller — Sprint 3.5
import { Request, Response }    from 'express';
import { dispatchService }      from './dispatch.service';
import { asyncHandler }         from '../../utils/async-handler';
import { HTTP_STATUS }          from '../../constants/api';
import { DispatchQueryParams }  from './dispatch.repository';

function parseQuery(raw: Record<string, unknown>): DispatchQueryParams {
  return {
    page:         Math.max(1, parseInt(String(raw.page  ?? '1'),  10)),
    limit:        Math.min(100, Math.max(1, parseInt(String(raw.limit ?? '20'), 10))),
    search:       String(raw.search ?? '').trim(),
    sort:         String(raw.sort   ?? 'createdAt').trim(),
    order:        raw.order === 'asc' ? 'asc' : 'desc',
    salesOrderId: raw.salesOrderId ? Number(raw.salesOrderId) : undefined,
    warehouseId:  raw.warehouseId  ? Number(raw.warehouseId)  : undefined,
  };
}

export class DispatchController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const raw    = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parseQuery(raw as Record<string, unknown>);
    const { data, meta } = await dispatchService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Dispatches retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const dispatch = await dispatchService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Dispatch retrieved successfully.',
      data:    dispatch,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dispatch = await dispatchService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Dispatch created successfully.',
      data:    dispatch,
    });
  });
}

export const dispatchController = new DispatchController();