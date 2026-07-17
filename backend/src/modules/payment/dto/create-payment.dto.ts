import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  invoiceId: z
    .number({ error: 'Invoice ID is required.' })
    .int('Invoice ID must be an integer.')
    .positive('Invoice ID must be positive.'),

  paymentDate: z
    .string()
    .datetime({ message: 'Payment date must be a valid ISO datetime.' })
    .optional(),

  paymentMethod: z.enum(
    ['CASH', 'BANK_TRANSFER', 'UPI', 'CARD', 'CHEQUE', 'OTHER'],
    { error: 'Payment method must be a valid value.' }
  ),

  referenceNumber: z
    .string()
    .max(100, 'Reference number cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),

  amount: z
    .number({ error: 'Amount is required.' })
    .positive('Amount must be greater than zero.')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places.'),

  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters.')
    .transform((val) => val.trim())
    .optional(),
});

export type CreatePaymentDTO = z.infer<typeof CreatePaymentSchema>;