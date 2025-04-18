// app/checkout/[step]/ReviewOrder.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useCheckout } from '../CheckoutContext';
import { useCart } from '@/context/CartContext';

const ReviewOrder: React.FC = () => {
  const { deliveryMethod, selectedBranchLabel } = useCheckout();
  const { cartItems } = useCart();

  const userName = 'Dorieliz';
  const orderNumber = 1;
  const totalProducts = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isStorePickup = deliveryMethod === 'store';

  return (
    <section className="space-y-8">
      <h2 className="text-xl font-medium text-gray-700">
        Confirmación de Orden
      </h2>
      <p className="text-sm text-gray-500">Orden #{orderNumber}</p>
      <p className="mb-4 text-sm text-gray-600">
        ¡Gracias por tu compra {userName}!
      </p>
      <p className="mb-4 text-sm text-gray-600">
        Productos en el carrito: {totalProducts}
      </p>

      {isStorePickup ? (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full lg:w-2/3">
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
        </div>
      ) : (
        <div className="text-sm text-gray-700">
          Revisión de la Orden completada.
        </div>
      )}
    </section>
  );
};

export default ReviewOrder;
