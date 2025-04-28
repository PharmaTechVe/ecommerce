'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OrderTable, {
  Order,
  OrderStatus,
} from '@/components/User/Order/UserOrdertable';
import { api } from '@/lib/sdkConfig';
import {
  OrderResponse,
  Pagination,
  OrderPaginationRequest,
} from '@pharmatech/sdk';
import { useAuth } from '@/context/AuthContext';

export default function OrdersPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  const mapStatus = (statusFromAPI: string): OrderStatus => {
    switch (statusFromAPI) {
      case 'requested':
        return 'pendiente';
      case 'paid':
        return 'pagado';
      case 'delivered':
        return 'entregado';
      default:
        return 'pendiente';
    }
  };

  const fetchOrders = React.useCallback(async () => {
    if (!token || !user?.sub) {
      console.error('Error de carga de ordenes');
      return;
    }

    try {
      const params: OrderPaginationRequest = {
        page: 1,
        limit: 100,
        userId: user.sub,
      };

      const response: Pagination<OrderResponse> = await api.order.findAll(
        params,
        token,
      );

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
    }
  }, [token, user?.sub]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewDetails = (orderId: string) => {
    router.push(`/user/order/${orderId}/detail`);
  };

  return (
    <div className="mx-auto max-w-5xl px-6">
      <OrderTable orders={orders} onViewDetails={handleViewDetails} />
    </div>
  );
}
