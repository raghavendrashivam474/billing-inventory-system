import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z
    .string({ error: 'Name is required.' })
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name cannot exceed 100 characters.')
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters.')
    .transform((val) => val.trim())
    .optional(),
});

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;