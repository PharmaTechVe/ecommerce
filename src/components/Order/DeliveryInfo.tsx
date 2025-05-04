'use client';

import React from 'react';
import { Colors } from '@/styles/styles';
import { OrderDetailedResponse } from '@pharmatech/sdk';

interface Props {
  order: OrderDetailedResponse;
}

const DeliveryInfo: React.FC<Props> = ({ order }) => {
  const deliveryAddress =
    order.branch?.address ||
    order.details?.[0]?.productPresentation.product.name ||
    'No asignado';

  const deliveryRecord = order.orderDeliveries?.[0];
  const deliveryPersonName = deliveryRecord?.employee
    ? `${deliveryRecord.employee.firstName} ${deliveryRecord.employee.lastName}`
    : 'No asignado';

  const contactPhone = deliveryRecord?.employee?.phoneNumber || 'No asignado';

  return (
    <section className="space-y-8">
      <h2
        className="sm:text-[20px] md:text-[40px]"
        style={{ color: Colors.textMain }}
      >
        Información del Repartidor
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border">
          <tbody>
            <tr>
              <td
                className="border px-4 py-2 font-semibold"
                style={{ color: Colors.textMain }}
              >
                Número de orden
              </td>
              <td
                className="border px-4 py-2"
                style={{ color: Colors.textMain }}
              >
                {order.id.slice(0, 8)}
              </td>
            </tr>
            <tr>
              <td
                className="border px-4 py-2 font-semibold"
                style={{ color: Colors.textMain }}
              >
                Dirección de entrega
              </td>
              <td
                className="border px-4 py-2"
                style={{ color: Colors.textMain }}
              >
                {deliveryAddress}
              </td>
            </tr>
            <tr>
              <td
                className="border px-4 py-2 font-semibold"
                style={{ color: Colors.textMain }}
              >
                Nombre del repartidor
              </td>
              <td
                className="border px-4 py-2"
                style={{ color: Colors.textMain }}
              >
                {deliveryPersonName}
              </td>
            </tr>
            <tr>
              <td
                className="border px-4 py-2 font-semibold"
                style={{ color: Colors.textMain }}
              >
                Teléfono de contacto
              </td>
              <td
                className="border px-4 py-2"
                style={{ color: Colors.textMain }}
              >
                {contactPhone}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DeliveryInfo;
