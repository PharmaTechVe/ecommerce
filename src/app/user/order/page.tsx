'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OrderTable, {
  Order,
  OrderStatus,
} from '@/components/User/Order/UserOrdertable';
import { api } from '@/lib/sdkConfig';

interface APIOrder {
  id: string;
  createdAt: string;
  status: string;
  totalPrice: number;
}

interface APIOrderResponse {
  results: APIOrder[];
  count: number;
  next: string | null;
  previous: string | null;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const mapStatus = (statusFromAPI: string): OrderStatus => {
    if (statusFromAPI === 'requested') return 'pendiente';
    if (statusFromAPI === 'paid') return 'pagado';
    if (statusFromAPI === 'delivered') return 'entregado';
    return 'pendiente';
  };

  const fetchOrders = React.useCallback(async () => {
    try {
      const response: APIOrderResponse = await api.order.findAll({
        page: 1,
        limit: 100,
      });

      const mapped: Order[] = response.results.map((order) => ({
        id: order.id,
        orderNumber: `#${order.id.slice(0, 8)}`,
        orderDate: new Date(order.createdAt).toLocaleDateString('es-ES'),
        status: mapStatus(order.status),
        totalPrice: order.totalPrice ?? 0,
      }));

      setOrders(mapped);
    } catch (error) {
      console.error('Error al cargar las órdenes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewDetails = (orderId: string) => {
    router.push(`/user/order/${orderId}/detail`);
  };

  return (
    <div className="mx-auto max-w-5xl px-6">
      {loading ? (
        <p className="text-center text-gray-600">Cargando órdenes...</p>
      ) : (
        <OrderTable orders={orders} onViewDetails={handleViewDetails} />
      )}
    </div>
  );
}
