// app/checkout/[step]/RejectedOrder.tsx
'use client';

import React from 'react';
import OrderSummary from '../OrderSummary';

const RejectedOrder: React.FC = () => {
  return (
    <section className="mt-8 flex flex-col gap-6 lg:flex-row">
      {/* Columna Izquierda: Información de la Orden Rechazada */}
      <div className="w-full space-y-6 lg:w-2/3">
        <h1 className="text-3xl font-bold text-red-600">Orden Rechazada</h1>
        <p className="text-sm text-gray-600">
          Lamentamos informarte que tu orden no pudo ser procesada.
        </p>
        <p className="text-sm text-gray-600">
          Revisa la información de tu pedido o comunícate con nuestro soporte
          para mayor asistencia. También puedes intentar realizar la compra
          nuevamente.
        </p>
      </div>
      {/* Columna Derecha: Resumen del Pedido */}
      <div className="w-full lg:w-1/3">
        <OrderSummary hideCoupon />
      </div>
    </section>
  );
};

export default RejectedOrder;
