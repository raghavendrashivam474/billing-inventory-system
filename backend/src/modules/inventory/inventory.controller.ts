// Inventory Controller — Sprint 3.2
import { Request, Response }    from 'express';
import { inventoryService }     from './inventory.service';
import { asyncHandler }         from '../../utils/async-handler';
import { HTTP_STATUS }          from '../../constants/api';
import { InventoryQueryParams } from './inventory.repository';

function parseQuery(raw: Record<string, unknown>): InventoryQueryParams {
  return {
    page:        Math.max(1, parseInt(String(raw.page  ?? '1'),  10)),
    limit:       Math.min(100, Math.max(1, parseInt(String(raw.limit ?? '20'), 10))),
    search:      String(raw.search ?? '').trim(),
    sort:        String(raw.sort   ?? 'updatedAt').trim(),
    order:       raw.order === 'asc' ? 'asc' : 'desc',
    productId:   raw.productId   ? Number(raw.productId)   : undefined,
    warehouseId: raw.warehouseId ? Number(raw.warehouseId) : undefined,
  };
}

export class InventoryController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const raw    = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parseQuery(raw as Record<string, unknown>);
    const { data, meta } = await inventoryService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Inventory retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id  = parseInt(String(req.params.id), 10);
    const inv = await inventoryService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Inventory record retrieved successfully.',
      data:    inv,
    });
  });

  getByProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const productId = parseInt(String(req.params.productId), 10);
    const result    = await inventoryService.getByProduct(productId);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product inventory retrieved successfully.',
      data:    result,
    });
  });
}

export const inventoryController = new InventoryController();