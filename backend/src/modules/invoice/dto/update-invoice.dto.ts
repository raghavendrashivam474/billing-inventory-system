import { z } from 'zod';

export const UpdateInvoiceSchema = z.object({
  dueDate: z
    .string()
    .datetime({ message: 'Due date must be a valid ISO datetime string.' })
    .optional(),

  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters.')
    .transform((val) => val.trim())
    .optional(),
});

export type UpdateInvoiceDTO = z.infer<typeof UpdateInvoiceSchema>;