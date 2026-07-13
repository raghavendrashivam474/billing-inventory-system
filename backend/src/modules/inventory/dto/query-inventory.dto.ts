import { z } from 'zod';

export const QueryInventorySchema = z.object({
  page:        z.string().optional().transform((v) => parseInt(v ?? '1',  10)),
  limit:       z.string().optional().transform((v) => parseInt(v ?? '20', 10)),
  search:      z.string().optional().default(''),
  sort:        z.string().optional().default('updatedAt'),
  order:       z.enum(['asc', 'desc']).optional().default('desc'),
  productId:   z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  warehouseId: z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
});

export type QueryInventoryDTO = z.infer<typeof QueryInventorySchema>;