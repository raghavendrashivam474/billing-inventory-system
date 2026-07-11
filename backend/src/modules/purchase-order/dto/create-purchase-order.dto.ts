import { z } from 'zod';

const PurchaseOrderItemSchema = z.object({
  productId: z
    .number({ error: 'Product ID is required.' })
    .int('Product ID must be an integer.')
    .positive('Product ID must be positive.'),

  quantity: z
    .number({ error: 'Quantity is required.' })
    .positive('Quantity must be greater than zero.')
    .multipleOf(0.001, 'Quantity supports up to 3 decimal places.'),

  unitCost: z
    .number({ error: 'Unit cost is required.' })
    .min(0, 'Unit cost cannot be negative.')
    .multipleOf(0.01, 'Unit cost must have at most 2 decimal places.'),
});

export const CreatePurchaseOrderSchema = z.object({
  supplierId: z
    .number({ error: 'Supplier ID is required.' })
    .int('Supplier ID must be an integer.')
    .positive('Supplier ID must be positive.'),

  warehouseId: z
    .number({ error: 'Warehouse ID is required.' })
    .int('Warehouse ID must be an integer.')
    .positive('Warehouse ID must be positive.'),

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
    .array(PurchaseOrderItemSchema)
    .min(1, 'At least one item is required.'),
});

export type CreatePurchaseOrderDTO      = z.infer<typeof CreatePurchaseOrderSchema>;
export type PurchaseOrderItemInputDTO   = z.infer<typeof PurchaseOrderItemSchema>;