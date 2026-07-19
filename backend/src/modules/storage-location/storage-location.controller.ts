// Storage Location Controller — Sprint 4.1
import { Request, Response }              from 'express';
import { storageLocationService }         from './storage-location.service';
import { asyncHandler }                   from '../../utils/async-handler';
import { HTTP_STATUS }                    from '../../constants/api';
import { StorageLocationQueryParams }     from './storage-location.repository';

function parseQuery(raw: Record<string, unknown>): StorageLocationQueryParams {
  return {
    page:        Math.max(1, parseInt(String(raw.page  ?? '1'),  10)),
    limit:       Math.min(100, Math.max(1, parseInt(String(raw.limit ?? '20'), 10))),
    search:      String(raw.search ?? '').trim(),
    sort:        String(raw.sort   ?? 'createdAt').trim(),
    order:       raw.order === 'asc' ? 'asc' : 'desc',
    warehouseId: raw.warehouseId ? Number(raw.warehouseId) : undefined,
    active:      raw.active === undefined ? undefined : raw.active === 'true',
  };
}

export class StorageLocationController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const raw    = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parseQuery(raw as Record<string, unknown>);
    const { data, meta } = await storageLocationService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Storage locations retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const location = await storageLocationService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Storage location retrieved successfully.',
      data:    location,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const location = await storageLocationService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Storage location created successfully.',
      data:    location,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const location = await storageLocationService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Storage location updated successfully.',
      data:    location,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const location = await storageLocationService.delete(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Storage location deactivated successfully.',
      data:    location,
    });
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const location = await storageLocationService.restore(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Storage location restored successfully.',
      data:    location,
    });
  });
}

export const storageLocationController = new StorageLocationController();