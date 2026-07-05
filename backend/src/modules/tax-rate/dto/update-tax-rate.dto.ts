import { z } from 'zod';

export const UpdateTaxRateSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),
  rate: z
    .number()
    .min(0,   'Rate cannot be negative.')
    .max(100, 'Rate cannot exceed 100.')
    .multipleOf(0.01, 'Rate must have at most 2 decimal places.')
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters.')
    .transform((val) => val.trim())
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateTaxRateDTO = z.infer<typeof UpdateTaxRateSchema>;