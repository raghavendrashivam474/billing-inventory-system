// Create Storage Location DTO — Sprint 4.1 (Placeholder)
import { z } from 'zod';

export const CreateStorageLocationSchema = z.object({
  warehouseId: z
    .number({ error: 'Warehouse ID is required.' })
    .int('Warehouse ID must be an integer.')
    .positive('Warehouse ID must be positive.'),

  code: z
    .string({ error: 'Code is required.' })
    .min(1, 'Code cannot be empty.')
    .max(50, 'Code cannot exceed 50 characters.')
    .transform((val) => val.trim().toUpperCase()),

  name: z
    .string({ error: 'Name is required.' })
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name cannot exceed 100 characters.')
    .transform((val) => val.trim()),

  description: z.string().max(500).transform((v) => v.trim()).optional(),
  aisle:       z.string().max(20).transform((v) => v.trim()).optional(),
  rack:        z.string().max(20).transform((v) => v.trim()).optional(),
  shelf:       z.string().max(20).transform((v) => v.trim()).optional(),
  bin:         z.string().max(20).transform((v) => v.trim()).optional(),
});

export type CreateStorageLocationDTO = z.infer<typeof CreateStorageLocationSchema>;