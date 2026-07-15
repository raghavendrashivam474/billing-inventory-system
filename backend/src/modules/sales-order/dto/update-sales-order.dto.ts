import { z } from 'zod';

const UpdateItemSchema = z.object({
  productId: z
    .number()
    .int('Product ID must be an integer.')
    .positive('Product ID must be positive.'),

  quantity: z
    .number()
    .positive('Quantity must be greater than zero.')
    .multipleOf(0.001, 'Quantity supports up to 3 decimal places.'),

  discountAmount: z
    .number()
    .min(0, 'Item discount cannot be negative.')
    .multipleOf(0.01, 'Discount must have at most 2 decimal places.')
    .optional()
    .default(0),
});

export const UpdateSalesOrderSchema = z.object({
  customerId: z
    .number()
    .int('Customer ID must be an integer.')
    .positive('Customer ID must be positive.')
    .optional(),

  warehouseId: z
    .number()
    .int('Warehouse ID must be an integer.')
    .positive('Warehouse ID must be positive.')
    .optional(),

  expectedDeliveryDate: z
    .string()
    .datetime({ message: 'Expected delivery date must be a valid ISO datetime.' })
    .optional(),

  discountAmount: z
    .number()
    .min(0, 'Order discount cannot be negative.')
    .multipleOf(0.01, 'Discount must have at most 2 decimal places.')
    .optional(),

  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters.')
    .transform((val) => val.trim())
    .optional(),

  items: z
    .array(UpdateItemSchema)
    .min(1, 'At least one item is required.')
    .optional(),
});

export type UpdateSalesOrderDTO = z.infer<typeof UpdateSalesOrderSchema>;