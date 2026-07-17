import { z } from 'zod';

export const QueryPaymentSchema = z.object({
  page:          z.string().optional().transform((v) => parseInt(v ?? '1',  10)),
  limit:         z.string().optional().transform((v) => parseInt(v ?? '20', 10)),
  search:        z.string().optional().default(''),
  sort:          z.string().optional().default('createdAt'),
  order:         z.enum(['asc', 'desc']).optional().default('desc'),
  invoiceId:     z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  customerId:    z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'UPI', 'CARD', 'CHEQUE', 'OTHER']).optional(),
});

export type QueryPaymentDTO = z.infer<typeof QueryPaymentSchema>;