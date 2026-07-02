// Brand Controller — Sprint 2.2
import { Request, Response }     from 'express';
import { brandService }          from './brand.service';
import { asyncHandler }          from '../../utils/async-handler';
import { HTTP_STATUS }           from '../../constants/api';
import { parsePaginationParams } from '../../utils/pagination';

export class BrandController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query  = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parsePaginationParams(query as Record<string, unknown>);
    const { data, meta } = await brandService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Brands retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id    = parseInt(String(req.params.id), 10);
    const brand = await brandService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Brand retrieved successfully.',
      data:    brand,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const brand = await brandService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Brand created successfully.',
      data:    brand,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id    = parseInt(String(req.params.id), 10);
    const brand = await brandService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Brand updated successfully.',
      data:    brand,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    await brandService.delete(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Brand deleted successfully.',
    });
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id    = parseInt(String(req.params.id), 10);
    const brand = await brandService.restore(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Brand restored successfully.',
      data:    brand,
    });
  });
}

export const brandController = new BrandController();