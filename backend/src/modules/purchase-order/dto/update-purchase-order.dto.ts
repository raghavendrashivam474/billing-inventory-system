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

  unitCost: z
    .number()
    .min(0, 'Unit cost cannot be negative.')
    .multipleOf(0.01, 'Unit cost must have at most 2 decimal places.'),
});

export const UpdatePurchaseOrderSchema = z.object({
  supplierId: z
    .number()
    .int('Supplier ID must be an integer.')
    .positive('Supplier ID must be positive.')
    .optional(),

  warehouseId: z
    .number()
    .int('Warehouse ID must be an integer.')
    .positive('Warehouse ID must be positive.')
    .optional(),

  expectedDate: z
    .string()
    .datetime({ message: 'Expected date must be a valid ISO date string.' })
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

export type UpdatePurchaseOrderDTO = z.infer<typeof UpdatePurchaseOrderSchema>;