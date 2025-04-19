// app/checkout/[step]/ReviewOrder.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useCheckout } from '../CheckoutContext';
//import { useCart } from '@/context/CartContext';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Colors } from '@/styles/styles';

const ReviewOrder: React.FC = () => {
  const { deliveryMethod, selectedBranchLabel } = useCheckout();
  //const { cartItems } = useCart();

  const userName = 'Dorieliz';
  const orderNumber = 1;
  //const totalProducts = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isStorePickup = deliveryMethod === 'store';

  return (
    <section className="space-y-8">
      <h2
        className="sm:text-[20px] md:text-[40px]"
        style={{ color: Colors.textMain }}
      >
        Confirmación de Orden
      </h2>
      <div className="flex items-center gap-4">
        {/* Primera columna: Ícono */}
        <div>
          <CheckCircleIcon
            className="h-[60px] w-[60px]"
            style={{ color: Colors.semanticSuccess }}
          />
        </div>

        {/* Segunda columna: Texto dividido en dos filas */}
        <div className="flex flex-col">
          <p
            className="sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            Orden #{orderNumber}
          </p>
          <p
            className="sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            ¡Gracias por tu compra {userName}!
          </p>
        </div>
      </div>
      <p
        className="mb-4 sm:text-[8px] md:text-[16px]"
        style={{ color: Colors.textMain }}
      >
        Tu pedido ya está listo para que pases por él en la sucursal indicada.
        En el mapa adjunto podrás ver la ubicación exacta para que llegues sin
        problemas.
      </p>
      {/* <p className="mb-4 text-sm text-gray-600">
        Productos en el carrito: {totalProducts}
      </p> */}

      {isStorePickup ? (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full lg:w-2/3">
            <p
              className="mb-2 mt-2 sm:text-[8px] md:text-[16px]"
              style={{ color: Colors.textMain }}
            >
              Sucursal de retiro: {selectedBranchLabel}
            </p>
            <Image
              src="/images/mapa.jpg"
              alt="Mapa"
              width={600}
              height={400}
              className="rounded-md border"
            />
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
