import { z } from 'zod';

export const addressSchema = z.object({
  estado: z.string().min(1, 'Selecciona un estado'),
  ciudad: z.string().min(1, 'Selecciona una ciudad'),
  direccion: z
    .string()
    .min(1, 'La dirección es obligatoria')
    .max(200, 'Máximo 200 caracteres'),
  codigoPostal: z
    .string()
    .regex(/^\d{4}$/, 'El código postal debe tener 4 dígitos'),
  informacionAdicional: z
    .string()
    .max(100, 'Máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  puntoReferencia: z
    .string()
    .max(300, 'Máximo 300 caracteres')
    .optional()
    .or(z.literal('')),
});
