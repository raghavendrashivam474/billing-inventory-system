// Update Storage Location DTO — Sprint 4.1 (Placeholder)
import { z } from 'zod';

export const UpdateStorageLocationSchema = z.object({
  code:        z.string().min(1).max(50).transform((v) => v.trim().toUpperCase()).optional(),
  name:        z.string().min(1).max(100).transform((v) => v.trim()).optional(),
  description: z.string().max(500).transform((v) => v.trim()).optional(),
  aisle:       z.string().max(20).transform((v) => v.trim()).optional(),
  rack:        z.string().max(20).transform((v) => v.trim()).optional(),
  shelf:       z.string().max(20).transform((v) => v.trim()).optional(),
  bin:         z.string().max(20).transform((v) => v.trim()).optional(),
  isActive:    z.boolean().optional(),
});

export type UpdateStorageLocationDTO = z.infer<typeof UpdateStorageLocationSchema>;