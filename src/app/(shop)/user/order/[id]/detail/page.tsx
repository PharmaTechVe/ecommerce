'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserOrderDetail from '@/components/User/Order/UserOrderDetail';
import { api } from '@/lib/sdkConfig';
import { OrderDetailedResponse } from '@pharmatech/sdk';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/app/loading';

export default function OrderDetailPage() {
  const params = useParams();
  const { token } = useAuth();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? '');
  const [orderData, setOrderData] = useState<OrderDetailedResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || !token) return;

      try {
        const order = await api.order.getById(id, token);
        setOrderData(order);
      } catch (error) {
        console.error('Error al obtener detalles del pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  return (
    <div className="relative bg-white px-2 py-6 sm:px-6 lg:px-8">
      {loading ? (
        <Loading />
      ) : orderData ? (
        <UserOrderDetail order={orderData} />
      ) : (
        <div className="mt-10 text-center text-gray-600">
          Pedido no encontrado.
        </div>
      )}
    </div>
  );
}
