// Payment Controller — Sprint 3.7
import { Request, Response }  from 'express';
import { paymentService }     from './payment.service';
import { asyncHandler }       from '../../utils/async-handler';
import { HTTP_STATUS }        from '../../constants/api';
import { PaymentQueryParams } from './payment.repository';
import { PaymentMethod }      from '@prisma/client';

function parseQuery(raw: Record<string, unknown>): PaymentQueryParams {
  return {
    page:          Math.max(1, parseInt(String(raw.page  ?? '1'),  10)),
    limit:         Math.min(100, Math.max(1, parseInt(String(raw.limit ?? '20'), 10))),
    search:        String(raw.search ?? '').trim(),
    sort:          String(raw.sort   ?? 'createdAt').trim(),
    order:         raw.order === 'asc' ? 'asc' : 'desc',
    invoiceId:     raw.invoiceId     ? Number(raw.invoiceId)     : undefined,
    customerId:    raw.customerId    ? Number(raw.customerId)    : undefined,
    paymentMethod: raw.paymentMethod as PaymentMethod | undefined,
  };
}

export class PaymentController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const raw    = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parseQuery(raw as Record<string, unknown>);
    const { data, meta } = await paymentService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Payments retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id      = parseInt(String(req.params.id), 10);
    const payment = await paymentService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Payment retrieved successfully.',
      data:    payment,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payment = await paymentService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Payment recorded successfully.',
      data:    payment,
    });
  });
}

export const paymentController = new PaymentController();