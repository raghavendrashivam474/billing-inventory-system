// Customer Controller — Sprint 2.5
import { Request, Response }     from 'express';
import { customerService }       from './customer.service';
import { asyncHandler }          from '../../utils/async-handler';
import { HTTP_STATUS }           from '../../constants/api';
import { parsePaginationParams } from '../../utils/pagination';

export class CustomerController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query  = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parsePaginationParams(query as Record<string, unknown>);
    const { data, meta } = await customerService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Customers retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const customer = await customerService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Customer retrieved successfully.',
      data:    customer,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const customer = await customerService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Customer created successfully.',
      data:    customer,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const customer = await customerService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Customer updated successfully.',
      data:    customer,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id), 10);
    await customerService.delete(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Customer deleted successfully.',
    });
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id       = parseInt(String(req.params.id), 10);
    const customer = await customerService.restore(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Customer restored successfully.',
      data:    customer,
    });
  });
}

export const customerController = new CustomerController();