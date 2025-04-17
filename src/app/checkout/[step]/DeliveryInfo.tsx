// app/checkout/[step]/DeliveryInfo.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const DeliveryInfo: React.FC = () => {
  const router = useRouter();

  // Simula que se ha asignado el repartidor.
  // En producción, aquí podrías hacer una llamada a la API o esperar un estado.
  const handleFinish = () => {
    // Redirige a una página final de éxito, por ejemplo.
    router.push('/checkout/successes');
  };

  return (
    <section className="space-y-8">
      <h2 className="text-xl font-medium text-gray-700">
        Información del Repartidor
      </h2>
      <p className="text-sm text-gray-600">
        Se ha asignado un repartidor para entregar su pedido.
      </p>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleFinish}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Finalizar Pedido
        </button>
      </div>
    </section>
  );
};

export default DeliveryInfo;
