import { z } from 'zod';

export const QueryProductSchema = z.object({
  page:       z.string().optional().transform((v) => parseInt(v ?? '1', 10)),
  limit:      z.string().optional().transform((v) => parseInt(v ?? '20', 10)),
  search:     z.string().optional().default(''),
  sort:       z.string().optional().default('createdAt'),
  order:      z.enum(['asc', 'desc']).optional().default('asc'),
  active:     z.enum(['true', 'false']).optional(),
  categoryId: z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  brandId:    z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  unitId:     z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  taxRateId:  z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
});

export type QueryProductDTO = z.infer<typeof QueryProductSchema>;