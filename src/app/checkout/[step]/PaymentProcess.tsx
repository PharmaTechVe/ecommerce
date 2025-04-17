// app/checkout/[step]/PaymentProcess.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useCheckout } from '../CheckoutContext';
import { useCart } from '@/context/CartContext';

const PaymentProcess: React.FC = () => {
  const { selectedBranchLabel } = useCheckout();
  const { cartItems } = useCart();

  // Instrucciones para Transferencia Bancaria
  const instructions =
    'Para completar su pago, realice la transferencia bancaria a la cuenta XXXX-XXXX-XXXX. Una vez realizada la transferencia, confirme la operación.';

  // Cálculo de la cantidad total de productos
  const totalProducts = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <section className="space-y-8">
      {/* Caja de instrucciones */}
      <div className="rounded-md border bg-gray-50 p-4">
        <p className="text-sm text-gray-600">{instructions}</p>
      </div>

      {/* Total de productos */}
      <p className="mb-4 text-sm text-gray-600">
        Productos en el carrito: {totalProducts}
      </p>

      {/* Visualización del mapa y sucursal */}
      <div className="mb-4">
        <Image
          src="/images/mapa.jpg"
          alt="Mapa"
          width={600}
          height={400}
          className="rounded-md border"
        />
        <p className="mt-2 text-sm text-gray-700">
          Sucursal de retiro: <strong>{selectedBranchLabel}</strong>
        </p>
      </div>
    </section>
  );
};

export default PaymentProcess;
