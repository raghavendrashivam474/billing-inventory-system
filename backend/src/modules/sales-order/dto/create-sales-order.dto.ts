import { z } from 'zod';

const SalesOrderItemSchema = z.object({
  productId: z
    .number({ error: 'Product ID is required.' })
    .int('Product ID must be an integer.')
    .positive('Product ID must be positive.'),

  quantity: z
    .number({ error: 'Quantity is required.' })
    .positive('Quantity must be greater than zero.')
    .multipleOf(0.001, 'Quantity supports up to 3 decimal places.'),

  discountAmount: z
    .number()
    .min(0, 'Item discount cannot be negative.')
    .multipleOf(0.01, 'Discount must have at most 2 decimal places.')
    .optional()
    .default(0),
});

export const CreateSalesOrderSchema = z.object({
  customerId: z
    .number({ error: 'Customer ID is required.' })
    .int('Customer ID must be an integer.')
    .positive('Customer ID must be positive.'),

  warehouseId: z
    .number({ error: 'Warehouse ID is required.' })
    .int('Warehouse ID must be an integer.')
    .positive('Warehouse ID must be positive.'),

  expectedDeliveryDate: z
    .string()
    .datetime({ message: 'Expected delivery date must be a valid ISO datetime.' })
    .optional(),

  discountAmount: z
    .number()
    .min(0, 'Order discount cannot be negative.')
    .multipleOf(0.01, 'Discount must have at most 2 decimal places.')
    .optional()
    .default(0),

  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters.')
    .transform((val) => val.trim())
    .optional(),

  items: z
    .array(SalesOrderItemSchema)
    .min(1, 'At least one item is required.'),
});

export type CreateSalesOrderDTO    = z.infer<typeof CreateSalesOrderSchema>;
export type SalesOrderItemInputDTO = z.infer<typeof SalesOrderItemSchema>;