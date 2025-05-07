'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserOrderDetail from '@/components/User/Order/UserOrderDetail';
import { api } from '@/lib/sdkConfig';
import { OrderResponse, OrderDetailResponse } from '@pharmatech/sdk';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/app/loading';

interface OrderDetailData {
  orderNumber: string;
  products: OrderDetailResponse[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

// Extends de OrderRespons  para incluir detalles
type ExtendedOrderResponse = OrderResponse & {
  details: OrderDetailResponse[];
};

export default function OrderDetailPage() {
  const params = useParams();
  const { token } = useAuth();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? '');
  const [orderData, setOrderData] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || !token) return;

      try {
        const order: ExtendedOrderResponse = await api.order.getById(id, token);

        const products: OrderDetailResponse[] = order.details;

        const subtotal = products.reduce((sum, item) => sum + item.subtotal, 0);

        const discount = products.reduce((acc, item) => {
          const promo = item.productPresentation.promo;
          if (promo) {
            const originalPrice =
              item.productPresentation.price * item.quantity;
            const itemDiscount = originalPrice - item.subtotal;
            return acc + itemDiscount;
          }
          return acc;
        }, 0);

        const tax = 0;
        const total = order.totalPrice;

        setOrderData({
          orderNumber: order.id,
          products,
          subtotal,
          discount,
          tax,
          total,
        });
      } catch (error) {
        console.error('Error al obtener detalles del pedido:', error);
        setOrderData(null);
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
        <UserOrderDetail {...orderData} />
      ) : (
        <div className="mt-10 text-center text-gray-600">
          Pedido no encontrado.
        </div>
      )}
    </div>
  );
}
