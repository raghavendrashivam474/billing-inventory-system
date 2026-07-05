import { z } from 'zod';

export const CreateUnitSchema = z.object({
  name: z
    .string({ error: 'Name is required.' })
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name cannot exceed 100 characters.')
    .transform((val) => val.trim()),
  abbreviation: z
    .string({ error: 'Abbreviation is required.' })
    .min(1, 'Abbreviation cannot be empty.')
    .max(10, 'Abbreviation cannot exceed 10 characters.')
    .transform((val) => val.trim().toUpperCase()),
});

export type CreateUnitDTO = z.infer<typeof CreateUnitSchema>;