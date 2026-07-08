import { z } from 'zod';

export const CreateWarehouseSchema = z.object({
  name: z
    .string({ error: 'Name is required.' })
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name cannot exceed 100 characters.')
    .transform((val) => val.trim()),

  code: z
    .string({ error: 'Code is required.' })
    .min(1, 'Code cannot be empty.')
    .max(20, 'Code cannot exceed 20 characters.')
    .transform((val) => val.trim().toUpperCase()),

  location: z
    .string({ error: 'Location is required.' })
    .min(1, 'Location cannot be empty.')
    .max(200, 'Location cannot exceed 200 characters.')
    .transform((val) => val.trim()),

  address: z
    .string()
    .max(500, 'Address cannot exceed 500 characters.')
    .transform((val) => val.trim())
    .optional(),

  city: z
    .string()
    .max(100, 'City cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),

  state: z
    .string()
    .max(100, 'State cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),

  country: z
    .string()
    .max(100, 'Country cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),

  postalCode: z
    .string()
    .max(20, 'Postal code cannot exceed 20 characters.')
    .transform((val) => val.trim())
    .optional(),

  managerName: z
    .string()
    .max(100, 'Manager name cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),

  managerPhone: z
    .string()
    .max(20, 'Manager phone cannot exceed 20 characters.')
    .transform((val) => val.trim())
    .optional(),

  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters.')
    .transform((val) => val.trim())
    .optional(),
});

export type CreateWarehouseDTO = z.infer<typeof CreateWarehouseSchema>;