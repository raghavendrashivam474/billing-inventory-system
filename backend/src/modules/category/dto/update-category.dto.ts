import { z } from 'zod';

export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters.')
    .transform((val) => val.trim())
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;