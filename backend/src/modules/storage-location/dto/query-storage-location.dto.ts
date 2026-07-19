// Query Storage Location DTO — Sprint 4.1 (Placeholder)
import { z } from 'zod';

export const QueryStorageLocationSchema = z.object({
  page:        z.string().optional().transform((v) => parseInt(v ?? '1',  10)),
  limit:       z.string().optional().transform((v) => parseInt(v ?? '20', 10)),
  search:      z.string().optional().default(''),
  sort:        z.string().optional().default('createdAt'),
  order:       z.enum(['asc', 'desc']).optional().default('desc'),
  warehouseId: z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  active:      z.enum(['true', 'false']).optional(),
});

export type QueryStorageLocationDTO = z.infer<typeof QueryStorageLocationSchema>;