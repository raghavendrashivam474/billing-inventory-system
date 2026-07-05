import { z } from 'zod';

export const UpdateUnitSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),
  abbreviation: z
    .string()
    .min(1, 'Abbreviation cannot be empty.')
    .max(10, 'Abbreviation cannot exceed 10 characters.')
    .transform((val) => val.trim().toUpperCase())
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUnitDTO = z.infer<typeof UpdateUnitSchema>;