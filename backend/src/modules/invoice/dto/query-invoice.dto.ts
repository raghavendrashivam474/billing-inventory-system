import { z } from 'zod';

export const QueryInvoiceSchema = z.object({
  page:        z.string().optional().transform((v) => parseInt(v ?? '1',  10)),
  limit:       z.string().optional().transform((v) => parseInt(v ?? '20', 10)),
  search:      z.string().optional().default(''),
  sort:        z.string().optional().default('createdAt'),
  order:       z.enum(['asc', 'desc']).optional().default('desc'),
  status:      z.enum(['DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'VOID']).optional(),
  customerId:  z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  salesOrderId: z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
});

export type QueryInvoiceDTO = z.infer<typeof QueryInvoiceSchema>;