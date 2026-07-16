import { z } from 'zod';

const DispatchItemSchema = z.object({
  salesOrderItemId: z
    .number({ error: 'Sales Order Item ID is required.' })
    .int('Sales Order Item ID must be an integer.')
    .positive('Sales Order Item ID must be positive.'),

  quantityDispatched: z
    .number({ error: 'Quantity dispatched is required.' })
    .positive('Quantity dispatched must be greater than zero.')
    .multipleOf(0.001, 'Quantity supports up to 3 decimal places.'),
});

export const CreateDispatchSchema = z.object({
  salesOrderId: z
    .number({ error: 'Sales Order ID is required.' })
    .int('Sales Order ID must be an integer.')
    .positive('Sales Order ID must be positive.'),

  dispatchDate: z
    .string({ error: 'Dispatch date is required.' })
    .datetime({ message: 'dispatchDate must be a valid ISO datetime string.' }),

  remarks: z
    .string()
    .max(1000, 'Remarks cannot exceed 1000 characters.')
    .transform((val) => val.trim())
    .optional(),

  items: z
    .array(DispatchItemSchema)
    .min(1, 'At least one item is required.'),
});

export type CreateDispatchDTO    = z.infer<typeof CreateDispatchSchema>;
export type DispatchItemInputDTO = z.infer<typeof DispatchItemSchema>;