'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import OrderTable from '@/components/User/Order/UserOrdertable';
import { mockOrders } from '@/lib/utils/fixtures/Order';

export default function OrdersPage() {
  const router = useRouter();

  const handleViewDetails = (orderId: string) => {
    router.push(`/user/order/${orderId}/detail`);
  };

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Mis Pedidos</h1>
      <OrderTable orders={mockOrders} onViewDetails={handleViewDetails} />
    </div>
  );
}
