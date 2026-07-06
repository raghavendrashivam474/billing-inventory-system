import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z
    .string({ error: 'Name is required.' })
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name cannot exceed 100 characters.')
    .transform((val) => val.trim()),

  sku: z
    .string({ error: 'SKU is required.' })
    .min(1, 'SKU cannot be empty.')
    .max(50, 'SKU cannot exceed 50 characters.')
    .transform((val) => val.trim().toUpperCase()),

  barcode: z
    .string()
    .max(100, 'Barcode cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),

  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters.')
    .transform((val) => val.trim())
    .optional(),

  costPrice: z
    .number({ error: 'Cost price must be a number.' })
    .min(0, 'Cost price cannot be negative.'),

  sellingPrice: z
    .number({ error: 'Selling price must be a number.' })
    .min(0.01, 'Selling price must be greater than zero.'),

  categoryId: z
    .number({ error: 'Category ID is required.' })
    .int('Category ID must be an integer.')
    .positive('Category ID must be positive.'),

  brandId: z
    .number()
    .int('Brand ID must be an integer.')
    .positive('Brand ID must be positive.')
    .optional(),

  unitId: z
    .number({ error: 'Unit ID is required.' })
    .int('Unit ID must be an integer.')
    .positive('Unit ID must be positive.'),

  taxRateId: z
    .number()
    .int('Tax Rate ID must be an integer.')
    .positive('Tax Rate ID must be positive.')
    .optional(),
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;