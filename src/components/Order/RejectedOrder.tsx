'use client';

import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { Colors } from '@/styles/styles';
import { OrderType } from '@pharmatech/sdk';

interface RejectedOrderProps {
  deliveryMethod: OrderType;
}

const RejectedOrder: React.FC<RejectedOrderProps> = ({ deliveryMethod }) => {
  const message =
    deliveryMethod === OrderType.PICKUP
      ? 'Lamentablemente hubo un problema al generar tu pedido para retiro en sucursal. Intente nuevamente y verifique los datos.'
      : 'Lamentamos informarte que hubo un problema al generar tu pedido. Intente nuevamente y verifique los datos.';
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
          <XCircleIcon
            className="h-[48px] w-[48px]"
            style={{ color: Colors.semanticDanger }}
          />
        </div>
        {/* Segunda columna: Texto dividido en dos filas */}
        <div className="flex flex-col">
          <p
            className="sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            Orden rechazada
          </p>
          <p
            className="sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            No pudimos procesar tu orden
          </p>
        </div>
      </div>
      <p
        className="mb-4 sm:text-[8px] md:text-[16px]"
        style={{ color: Colors.textMain }}
      >
        {message}
      </p>
    </section>
  );
};

export default RejectedOrder;
