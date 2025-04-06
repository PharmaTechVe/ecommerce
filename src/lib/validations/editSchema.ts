import { z } from 'zod';

const NAME_REGEX = /^[a-zA-Z\s]+$/;
const ONLY_DIGITS_REGEX = /^\d+$/;
const PHONE_REGEX = /^\+\d{8,15}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isNonEmpty = (fieldName: string) =>
  z.string().nonempty(`${fieldName} es obligatorio`);

const toNullIfEmpty = (value: string) => (value.trim() === '' ? null : value);

function validateDateIsAtLeast14Years(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateParsed = new Date(year, month - 1, day);
  if (isNaN(dateParsed.getTime())) return false;

  const today = new Date();
  const minAllowedDate = new Date(
    today.getFullYear() - 14,
    today.getMonth(),
    today.getDate(),
  );
  return dateParsed <= minAllowedDate;
}

export const editUserSchema = z.object({
  firstName: isNonEmpty('El nombre')
    .min(2, 'Debe tener al menos 2 caracteres')
    .max(50, 'No puede exceder los 50 caracteres')
    .regex(NAME_REGEX, 'Solo puede contener letras'),

  lastName: isNonEmpty('El apellido')
    .min(2, 'Debe tener al menos 2 caracteres')
    .max(50, 'No puede exceder los 50 caracteres')
    .regex(NAME_REGEX, 'Solo puede contener letras'),

  email: isNonEmpty('El email').email('Formato de email inválido'),

  documentId: isNonEmpty('La cédula').regex(
    ONLY_DIGITS_REGEX,
    'Debe contener solo números',
  ),

  phoneNumber: z
    .string()
    .transform(toNullIfEmpty)
    .nullable()
    .refine(
      (value) => value === null || PHONE_REGEX.test(value),
      'El teléfono debe iniciar con + y tener entre 8 y 15 dígitos',
    ),

  birthDate: isNonEmpty('La fecha de nacimiento')
    .regex(DATE_REGEX, 'Formato inválido (yyyy-mm-dd)')
    .refine(validateDateIsAtLeast14Years, {
      message: 'Debes tener al menos 14 años',
    }),

  gender: z.enum(['m', 'f']),
});
