'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import { Colors } from '@/styles/styles';
import { OrderDetailedResponse } from '@pharmatech/sdk';

interface Props {
  orderId: string;
}

const DeliveryInfo: React.FC<Props> = ({ orderId }) => {
  const { token } = useAuth();
  const [orderDetail, setOrderDetail] = useState<OrderDetailedResponse | null>(
    null,
  );

  useEffect(() => {
    if (!orderId || !token) return;
    api.order.getById(orderId, token).then(setOrderDetail).catch(console.error);
  }, [orderId, token]);

  const orderNumber = orderDetail?.id || 'No asignado';

  const deliveryAddress =
    orderDetail?.branch?.address ||
    orderDetail?.details?.[0]?.productPresentation.product.name ||
    'No asignado';

  const deliveryRecord = orderDetail?.orderDeliveries?.[0];
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
                {orderNumber}
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
