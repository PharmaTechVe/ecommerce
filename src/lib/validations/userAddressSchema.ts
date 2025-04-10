import { z } from 'zod';

export const addressSchema = z.object({
  state: z.string().min(1, 'Selecciona un estado'),
  city: z.string().min(1, 'Selecciona una ciudad'),
  address: z
    .string()
    .min(1, 'La dirección es obligatoria')
    .max(200, 'Máximo 200 caracteres'),
  zipCode: z.string().regex(/^\d{4}$/, 'El código postal debe tener 4 dígitos'),
  additionalInfo: z
    .string()
    .max(100, 'Máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  referencePoint: z
    .string()
    .max(300, 'Máximo 300 caracteres')
    .optional()
    .or(z.literal('')),
});
