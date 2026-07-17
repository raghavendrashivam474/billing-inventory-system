import { z } from 'zod';

export const CreateInvoiceSchema = z.object({
  salesOrderId: z
    .number({ error: 'Sales Order ID is required.' })
    .int('Sales Order ID must be an integer.')
    .positive('Sales Order ID must be positive.'),

  dispatchId: z
    .number({ error: 'Dispatch ID is required.' })
    .int('Dispatch ID must be an integer.')
    .positive('Dispatch ID must be positive.'),

  dueDate: z
    .string()
    .datetime({ message: 'Due date must be a valid ISO datetime string.' })
    .optional(),

  discountAmount: z
    .number()
    .min(0, 'Discount cannot be negative.')
    .multipleOf(0.01, 'Discount must have at most 2 decimal places.')
    .optional()
    .default(0),

  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters.')
    .transform((val) => val.trim())
    .optional(),
});

export type CreateInvoiceDTO = z.infer<typeof CreateInvoiceSchema>;