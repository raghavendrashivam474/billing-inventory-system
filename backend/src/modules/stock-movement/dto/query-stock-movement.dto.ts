import { z } from 'zod';

export const QueryStockMovementSchema = z.object({
  page:          z.string().optional().transform((v) => parseInt(v ?? '1',  10)),
  limit:         z.string().optional().transform((v) => parseInt(v ?? '20', 10)),
  sort:          z.string().optional().default('createdAt'),
  order:         z.enum(['asc', 'desc']).optional().default('desc'),
  productId:     z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  warehouseId:   z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  type:          z.enum([
    'PURCHASE_RECEIPT','SALE','ADJUSTMENT_IN','ADJUSTMENT_OUT',
    'TRANSFER_IN','TRANSFER_OUT','RETURN_IN','RETURN_OUT',
  ]).optional(),
  referenceType: z.enum([
    'GOODS_RECEIPT','SALES_ORDER','STOCK_ADJUSTMENT','STOCK_TRANSFER','RETURN',
  ]).optional(),
  referenceId:   z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  from:          z.string().optional(),
  to:            z.string().optional(),
});

export type QueryStockMovementDTO = z.infer<typeof QueryStockMovementSchema>;