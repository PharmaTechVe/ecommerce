import { z } from 'zod';

export const emailSchema = z
  .string()
  .nonempty('El email es obligatorio')
  .email('Formato de email inválido');

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty('La contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(255, 'La contraseña no puede exceder 255 caracteres'),

    confirmPassword: z
      .string()
      .nonempty('La confirmación es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(255, 'La contraseña no puede exceder 255 caracteres'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const codeSchema = z
  .string()
  .length(6, 'El código debe tener 6 dígitos');
