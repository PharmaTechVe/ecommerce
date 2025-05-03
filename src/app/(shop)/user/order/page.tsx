'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OrderTable from '@/components/User/Order/UserOrdertable';
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
  const [orders, setOrders] = useState<OrderResponse[]>([]);

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
      setOrders(response.results);
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
