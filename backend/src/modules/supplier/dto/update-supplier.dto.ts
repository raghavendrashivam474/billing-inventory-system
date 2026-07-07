import { z } from 'zod';

export const UpdateSupplierSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),

  contactPerson: z
    .string()
    .max(100, 'Contact person cannot exceed 100 characters.')
    .transform((val) => val.trim())
    .optional(),

  email: z
    .string()
    .email('Invalid email address.')
    .optional(),

  phone: z
    .string()
    .max(20, 'Phone cannot exceed 20 characters.')
    .transform((val) => val.trim())
    .optional(),

  gstNumber: z
    .string()
    .max(20, 'GST number cannot exceed 20 characters.')
    .transform((val) => val.trim().toUpperCase())
    .optional(),

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

  isActive: z.boolean().optional(),
});

export type UpdateSupplierDTO = z.infer<typeof UpdateSupplierSchema>;