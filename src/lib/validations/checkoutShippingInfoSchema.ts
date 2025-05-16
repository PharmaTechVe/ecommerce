import { z } from 'zod';

export const checkoutShippingInfoSchema = z
  .object({
    shippingMethod: z.string().min(1, 'Debes seleccionar una opción de compra'),
    branch: z.string().min(1, 'Debes seleccionar una sucursal/dirección'),
    paymentMethod: z.string().min(1, 'Debes seleccionar un método de pago'),
  })
  .refine(
    () => {
      // Aquí puedes poner cualquier lógica adicional si es necesario.
      // Ejemplo: Si se selecciona "Envío a Domicilio", la dirección debe ser válida, etc.
      return true; // Aquí se puede agregar lógica como validación de combinación de opciones
    },
    {
      message:
        'Por favor, asegurate de que todas las opciones estén bien seleccionadas',
      path: ['shippingMethod', 'branch', 'paymentMethod'], // Asegura que todas las opciones estén bien seleccionadas
    },
  );
