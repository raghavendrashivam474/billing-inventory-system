import { z } from 'zod';

export const CreateTaxRateSchema = z.object({
  name: z
    .string({ error: 'Name is required.' })
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name cannot exceed 100 characters.')
    .transform((val) => val.trim()),
  rate: z
    .number({ error: 'Rate must be a number.' })
    .min(0,   'Rate cannot be negative.')
    .max(100, 'Rate cannot exceed 100.')
    .multipleOf(0.01, 'Rate must have at most 2 decimal places.'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters.')
    .transform((val) => val.trim())
    .optional(),
});

export type CreateTaxRateDTO = z.infer<typeof CreateTaxRateSchema>;