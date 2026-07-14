import { z } from 'zod';

export const CreateStockAdjustmentSchema = z.object({
  productId: z
    .number({ error: 'Product ID is required.' })
    .int('Product ID must be an integer.')
    .positive('Product ID must be positive.'),

  warehouseId: z
    .number({ error: 'Warehouse ID is required.' })
    .int('Warehouse ID must be an integer.')
    .positive('Warehouse ID must be positive.'),

  adjustmentType: z.enum(['INCREASE', 'DECREASE'], {
    error: 'Adjustment type must be INCREASE or DECREASE.',
  }),

  quantity: z
    .number({ error: 'Quantity is required.' })
    .positive('Quantity must be greater than zero.')
    .multipleOf(0.001, 'Quantity supports up to 3 decimal places.'),

  reason: z.enum([
    'PHYSICAL_COUNT',
    'DAMAGED',
    'LOST',
    'EXPIRED',
    'DATA_CORRECTION',
    'OTHER',
  ], { error: 'Reason must be a valid adjustment reason.' }),

  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters.')
    .transform((val) => val.trim())
    .optional(),
});

export type CreateStockAdjustmentDTO = z.infer<typeof CreateStockAdjustmentSchema>;