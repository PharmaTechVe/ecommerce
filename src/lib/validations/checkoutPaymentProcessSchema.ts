import { z } from 'zod';

export const checkoutPaymentProcessSchema = z.object({
  bank: z
    .string()
    .nonempty('El banco es obligatorio')
    .max(100, 'El banco no puede tener más de 100 caracteres')
    .refine(
      (value) => value.trim().length > 0,
      'El banco no puede estar vacío',
    ), // Refine para asegurar que no esté vacío

  reference: z
    .string()
    .nonempty('La referencia es obligatoria')
    .regex(/^\d+$/, 'La referencia debe contener solo números')
    .max(100, 'La referencia no puede tener más de 100 caracteres')
    .refine(
      (value) => value.trim().length > 0,
      'La referencia no puede estar vacía',
    ), // Refine para asegurar que no esté vacío

  documentId: z
    .string()
    .nonempty('El número de documento es obligatorio')
    .regex(/^\d+$/, 'El número de documento debe contener solo números')
    .refine(
      (value) => value.trim().length > 0,
      'El número de documento no puede estar vacío',
    ), // Refine para asegurar que no esté vacío

  phoneNumber: z
    .string()
    .trim() // Elimina espacios en blanco al inicio y al final
    .refine(
      (value) => /^\+\d{8,15}$/.test(value), // El teléfono debe iniciar con + y tener entre 8 y 15 dígitos
      'El teléfono debe iniciar con + y tener entre 8 y 15 dígitos',
    ),
});
