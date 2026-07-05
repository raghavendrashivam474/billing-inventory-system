// Tax Rate Controller — Sprint 2.3
import { Request, Response }     from 'express';
import { taxRateService }        from './tax-rate.service';
import { asyncHandler }          from '../../utils/async-handler';
import { HTTP_STATUS }           from '../../constants/api';
import { parsePaginationParams } from '../../utils/pagination';

export class TaxRateController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query  = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parsePaginationParams(query as Record<string, unknown>);
    const { data, meta } = await taxRateService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Tax Rates retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id      = parseInt(String(req.params.id), 10);
    const taxRate = await taxRateService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Tax Rate retrieved successfully.',
      data:    taxRate,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const taxRate = await taxRateService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Tax Rate created successfully.',
      data:    taxRate,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id      = parseInt(String(req.params.id), 10);
    const taxRate = await taxRateService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Tax Rate updated successfully.',
      data:    taxRate,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    await taxRateService.delete(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Tax Rate deleted successfully.',
    });
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id      = parseInt(String(req.params.id), 10);
    const taxRate = await taxRateService.restore(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Tax Rate restored successfully.',
      data:    taxRate,
    });
  });
}

export const taxRateController = new TaxRateController();