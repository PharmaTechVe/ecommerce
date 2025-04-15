'use client';
import React from 'react';
import OrderTable from '@/components/User/UserOrdertable';
import { mockOrders } from '@/lib/utils/api/Order';

export default function OrdersPage() {
  const handleViewDetails = (orderId: string) => {
    console.log('Ver detalles de la orden:', orderId);
  };

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Mis Pedidos</h1>
      <OrderTable orders={mockOrders} onViewDetails={handleViewDetails} />
    </div>
  );
}
