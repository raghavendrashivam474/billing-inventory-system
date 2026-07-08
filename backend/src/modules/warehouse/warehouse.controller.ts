// Warehouse Controller — Sprint 2.6
import { Request, Response }     from 'express';
import { warehouseService }      from './warehouse.service';
import { asyncHandler }          from '../../utils/async-handler';
import { HTTP_STATUS }           from '../../constants/api';
import { parsePaginationParams } from '../../utils/pagination';

export class WarehouseController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query  = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parsePaginationParams(query as Record<string, unknown>);
    const { data, meta } = await warehouseService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Warehouses retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id        = parseInt(String(req.params.id), 10);
    const warehouse = await warehouseService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Warehouse retrieved successfully.',
      data:    warehouse,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const warehouse = await warehouseService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Warehouse created successfully.',
      data:    warehouse,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id        = parseInt(String(req.params.id), 10);
    const warehouse = await warehouseService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Warehouse updated successfully.',
      data:    warehouse,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    await warehouseService.delete(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Warehouse deleted successfully.',
    });
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id        = parseInt(String(req.params.id), 10);
    const warehouse = await warehouseService.restore(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Warehouse restored successfully.',
      data:    warehouse,
    });
  });
}

export const warehouseController = new WarehouseController();