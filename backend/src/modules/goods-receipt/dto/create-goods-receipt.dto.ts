import { z } from 'zod';

const GoodsReceiptItemSchema = z.object({
  purchaseOrderItemId: z
    .number({ error: 'Purchase Order Item ID is required.' })
    .int('Purchase Order Item ID must be an integer.')
    .positive('Purchase Order Item ID must be positive.'),

  receivedQuantity: z
    .number({ error: 'Received quantity is required.' })
    .positive('Received quantity must be greater than zero.')
    .multipleOf(0.001, 'Quantity supports up to 3 decimal places.'),
});

export const CreateGoodsReceiptSchema = z.object({
  purchaseOrderId: z
    .number({ error: 'Purchase Order ID is required.' })
    .int('Purchase Order ID must be an integer.')
    .positive('Purchase Order ID must be positive.'),

  receivedAt: z
    .string({ error: 'Received date is required.' })
    .datetime({ message: 'receivedAt must be a valid ISO datetime string.' }),

  supplierInvoiceNumber: z
    .string()
    .max(100, 'Supplier invoice number cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),

  deliveryReference: z
    .string()
    .max(100, 'Delivery reference cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),

  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters.')
    .transform((val) => val.trim())
    .optional(),

  items: z
    .array(GoodsReceiptItemSchema)
    .min(1, 'At least one item is required.'),
});

export type CreateGoodsReceiptDTO     = z.infer<typeof CreateGoodsReceiptSchema>;
export type GoodsReceiptItemInputDTO  = z.infer<typeof GoodsReceiptItemSchema>;