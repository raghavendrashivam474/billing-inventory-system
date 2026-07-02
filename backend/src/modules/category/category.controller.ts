// Category Controller — Sprint 2.2
import { Request, Response }     from 'express';
import { categoryService }       from './category.service';
import { asyncHandler }          from '../../utils/async-handler';
import { HTTP_STATUS }           from '../../constants/api';
import { parsePaginationParams } from '../../utils/pagination';

export class CategoryController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query  = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parsePaginationParams(query as Record<string, unknown>);
    const { data, meta } = await categoryService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Categories retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const category = await categoryService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Category retrieved successfully.',
      data:    category,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const category = await categoryService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Category created successfully.',
      data:    category,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const category = await categoryService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Category updated successfully.',
      data:    category,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    await categoryService.delete(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const category = await categoryService.restore(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Category restored successfully.',
      data:    category,
    });
  });
}

export const categoryController = new CategoryController();