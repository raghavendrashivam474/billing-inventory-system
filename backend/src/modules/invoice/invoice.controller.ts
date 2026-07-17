// Invoice Controller — Sprint 3.6
import { Request, Response }    from 'express';
import { invoiceService }       from './invoice.service';
import { asyncHandler }         from '../../utils/async-handler';
import { HTTP_STATUS }          from '../../constants/api';
import { InvoiceQueryParams }   from './invoice.repository';
import { InvoiceStatus }        from '@prisma/client';

function parseQuery(raw: Record<string, unknown>): InvoiceQueryParams {
  return {
    page:         Math.max(1, parseInt(String(raw.page  ?? '1'),  10)),
    limit:        Math.min(100, Math.max(1, parseInt(String(raw.limit ?? '20'), 10))),
    search:       String(raw.search ?? '').trim(),
    sort:         String(raw.sort   ?? 'createdAt').trim(),
    order:        raw.order === 'asc' ? 'asc' : 'desc',
    status:       raw.status       as InvoiceStatus | undefined,
    customerId:   raw.customerId   ? Number(raw.customerId)   : undefined,
    salesOrderId: raw.salesOrderId ? Number(raw.salesOrderId) : undefined,
  };
}

export class InvoiceController {

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const raw    = (req as Request & { parsedQuery?: unknown }).parsedQuery ?? req.query;
    const params = parseQuery(raw as Record<string, unknown>);
    const { data, meta } = await invoiceService.getAll(params);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Invoices retrieved successfully.',
      data,
      meta,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id      = parseInt(String(req.params.id), 10);
    const invoice = await invoiceService.getById(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Invoice retrieved successfully.',
      data:    invoice,
    });
  });

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const invoice = await invoiceService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Invoice created successfully.',
      data:    invoice,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id      = parseInt(String(req.params.id), 10);
    const invoice = await invoiceService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Invoice updated successfully.',
      data:    invoice,
    });
  });

  issue = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id      = parseInt(String(req.params.id), 10);
    const invoice = await invoiceService.issue(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Invoice issued successfully.',
      data:    invoice,
    });
  });

  void = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id      = parseInt(String(req.params.id), 10);
    const invoice = await invoiceService.void(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Invoice voided successfully.',
      data:    invoice,
    });
  });
}

export const invoiceController = new InvoiceController();