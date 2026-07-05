import { z } from 'zod';

export const QueryTaxRateSchema = z.object({
  page:   z.string().optional().transform((v) => parseInt(v ?? '1', 10)),
  limit:  z.string().optional().transform((v) => parseInt(v ?? '20', 10)),
  search: z.string().optional().default(''),
  sort:   z.string().optional().default('createdAt'),
  order:  z.enum(['asc', 'desc']).optional().default('asc'),
  active: z.enum(['true', 'false']).optional(),
});

export type QueryTaxRateDTO = z.infer<typeof QueryTaxRateSchema>;