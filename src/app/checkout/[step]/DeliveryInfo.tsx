// app/checkout/[step]/DeliveryInfo.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Colors } from '@/styles/styles';

const DeliveryInfo: React.FC = () => {
  const router = useRouter();

  // Simula que se ha asignado el repartidor.
  // En producción, aquí podrías hacer una llamada a la API o esperar un estado.
  const handleFinish = () => {
    // Redirige a una página final de éxito, por ejemplo.
    router.push('/checkout/Successes');
  };

  //Falta cambiar esto por los datos reales de la API
  const orderNumber = '#12345';
  const deliveryAddress =
    'Urbanización Balle Verde, Carrera 15, calle 18, Barquisimeto, 3001';
  const deliveryPersonName = 'Juan Villegas';
  const contactPhone = '+58 4245119640';

  return (
    <section className="space-y-8">
      <h2
        className="sm:text-[20px] md:text-[40px]"
        style={{ color: Colors.textMain }}
      >
        Información del Repartidor
      </h2>

      {/* Tabla de Información */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border">
          <tbody>
            <tr>
              <td
                className="border px-4 py-2 font-semibold sm:text-[12px] md:text-[18px]"
                style={{ color: Colors.textMain }}
              >
                Número de orden
              </td>
              <td
                className="border px-4 py-2 sm:text-[12px] md:text-[18px]"
                style={{ color: Colors.textMain }}
              >
                {orderNumber}
              </td>
            </tr>
            <tr>
              <td
                className="border px-4 py-2 font-semibold sm:text-[12px] md:text-[18px]"
                style={{ color: Colors.textMain }}
              >
                Dirección de entrega
              </td>
              <td
                className="border px-4 py-2 sm:text-[12px] md:text-[18px]"
                style={{ color: Colors.textMain }}
              >
                {deliveryAddress}
              </td>
            </tr>
            <tr>
              <td
                className="border px-4 py-2 font-semibold sm:text-[12px] md:text-[18px]"
                style={{ color: Colors.textMain }}
              >
                Nombre del repartidor
              </td>
              <td
                className="border px-4 py-2 sm:text-[12px] md:text-[18px]"
                style={{ color: Colors.textMain }}
              >
                {deliveryPersonName}
              </td>
            </tr>
            <tr>
              <td
                className="border px-4 py-2 font-semibold sm:text-[12px] md:text-[18px]"
                style={{ color: Colors.textMain }}
              >
                Teléfono de contacto
              </td>
              <td
                className="border px-4 py-2 sm:text-[12px] md:text-[18px]"
                style={{ color: Colors.textMain }}
              >
                {contactPhone}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
