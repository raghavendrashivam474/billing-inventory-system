import { z } from 'zod';

export const QueryStockAdjustmentSchema = z.object({
  page:           z.string().optional().transform((v) => parseInt(v ?? '1',  10)),
  limit:          z.string().optional().transform((v) => parseInt(v ?? '20', 10)),
  search:         z.string().optional().default(''),
  sort:           z.string().optional().default('createdAt'),
  order:          z.enum(['asc', 'desc']).optional().default('desc'),
  productId:      z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  warehouseId:    z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  adjustmentType: z.enum(['INCREASE', 'DECREASE']).optional(),
  reason:         z.enum([
    'PHYSICAL_COUNT','DAMAGED','LOST','EXPIRED','DATA_CORRECTION','OTHER',
  ]).optional(),
  fromDate:       z.string().optional(),
  toDate:         z.string().optional(),
});

export type QueryStockAdjustmentDTO = z.infer<typeof QueryStockAdjustmentSchema>;