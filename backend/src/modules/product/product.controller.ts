// Product Controller — Sprint 2.4
import { Request, Response }  from 'express';
import { productService }     from './product.service';
import { asyncHandler }       from '../../utils/async-handler';
import { HTTP_STATUS }        from '../../constants/api';
import { ProductQueryParams } from './product.repository';

function parseQueryParams(raw: Record<string, unknown>): ProductQueryParams {
  return {
    page:       Math.max(1, parseInt(String(raw.page  ?? '1'),  10)),
    limit:      Math.min(100, Math.max(1, parseInt(String(raw.limit ?? '20'), 10))),
    search:     String(raw.search ?? '').trim(),
    sort:       String(raw.sort   ?? 'createdAt').trim(),
    order:      raw.order === 'desc' ? 'desc' : 'asc',
    active:     raw.active === undefined ? undefined : raw.active === 'true',
    categoryId: raw.categoryId !== undefined ? Number(raw.categoryId) : undefined,
    brandId:    raw.brandId    !== undefined ? Number(raw.brandId)    : undefined,
    unitId:     raw.unitId     !== undefined ? Number(raw.unitId)     : undefined,
    taxRateId:  raw.taxRateId  !== undefined ? Number(raw.taxRateId)  : undefined,
  };
}

export class ProductController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const raw    = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parseQueryParams(raw as Record<string, unknown>);
    const { data, meta } = await productService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Products retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id      = parseInt(String(req.params.id), 10);
    const product = await productService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product retrieved successfully.',
      data:    product,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const product = await productService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Product created successfully.',
      data:    product,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id      = parseInt(String(req.params.id), 10);
    const product = await productService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product updated successfully.',
      data:    product,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    await productService.delete(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id      = parseInt(String(req.params.id), 10);
    const product = await productService.restore(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product restored successfully.',
      data:    product,
    });
  });
}

export const productController = new ProductController();