import { z } from 'zod';

export const UpdateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),

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
    .number()
    .min(0, 'Cost price cannot be negative.')
    .optional(),

  sellingPrice: z
    .number()
    .min(0.01, 'Selling price must be greater than zero.')
    .optional(),

  categoryId: z
    .number()
    .int('Category ID must be an integer.')
    .positive('Category ID must be positive.')
    .optional(),

  brandId: z
    .number()
    .int('Brand ID must be an integer.')
    .positive('Brand ID must be positive.')
    .optional(),

  unitId: z
    .number()
    .int('Unit ID must be an integer.')
    .positive('Unit ID must be positive.')
    .optional(),

  taxRateId: z
    .number()
    .int('Tax Rate ID must be an integer.')
    .positive('Tax Rate ID must be positive.')
    .optional(),

  isActive: z.boolean().optional(),
});

export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;