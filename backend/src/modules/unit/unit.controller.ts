// Unit Controller — Sprint 2.3
import { Request, Response }     from 'express';
import { unitService }           from './unit.service';
import { asyncHandler }          from '../../utils/async-handler';
import { HTTP_STATUS }           from '../../constants/api';
import { parsePaginationParams } from '../../utils/pagination';

export class UnitController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query  = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parsePaginationParams(query as Record<string, unknown>);
    const { data, meta } = await unitService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Units retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id   = parseInt(String(req.params.id), 10);
    const unit = await unitService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Unit retrieved successfully.',
      data:    unit,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const unit = await unitService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Unit created successfully.',
      data:    unit,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id   = parseInt(String(req.params.id), 10);
    const unit = await unitService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Unit updated successfully.',
      data:    unit,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    await unitService.delete(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Unit deleted successfully.',
    });
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id   = parseInt(String(req.params.id), 10);
    const unit = await unitService.restore(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Unit restored successfully.',
      data:    unit,
    });
  });
}

export const unitController = new UnitController();