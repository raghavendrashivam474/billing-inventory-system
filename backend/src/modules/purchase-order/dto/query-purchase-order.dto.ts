import { z } from 'zod';

export const QueryPurchaseOrderSchema = z.object({
  page:        z.string().optional().transform((v) => parseInt(v ?? '1',  10)),
  limit:       z.string().optional().transform((v) => parseInt(v ?? '20', 10)),
  search:      z.string().optional().default(''),
  sort:        z.string().optional().default('createdAt'),
  order:       z.enum(['asc', 'desc']).optional().default('desc'),
  status:      z.enum(['DRAFT', 'CONFIRMED', 'CANCELLED']).optional(),
  supplierId:  z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  warehouseId: z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  fromDate:    z.string().optional(),
  toDate:      z.string().optional(),
});

export type QueryPurchaseOrderDTO = z.infer<typeof QueryPurchaseOrderSchema>;