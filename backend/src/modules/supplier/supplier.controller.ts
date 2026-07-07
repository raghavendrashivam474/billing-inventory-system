// Supplier Controller — Sprint 2.5
import { Request, Response }     from 'express';
import { supplierService }       from './supplier.service';
import { asyncHandler }          from '../../utils/async-handler';
import { HTTP_STATUS }           from '../../constants/api';
import { parsePaginationParams } from '../../utils/pagination';

export class SupplierController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query  = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parsePaginationParams(query as Record<string, unknown>);
    const { data, meta } = await supplierService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Suppliers retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const supplier = await supplierService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Supplier retrieved successfully.',
      data:    supplier,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const supplier = await supplierService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Supplier created successfully.',
      data:    supplier,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const supplier = await supplierService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Supplier updated successfully.',
      data:    supplier,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    await supplierService.delete(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Supplier deleted successfully.',
    });
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const supplier = await supplierService.restore(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Supplier restored successfully.',
      data:    supplier,
    });
  });
}

export const supplierController = new SupplierController();