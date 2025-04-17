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
    <div className="mx-auto max-w-5xl px-6">
      <OrderTable orders={mockOrders} onViewDetails={handleViewDetails} />
    </div>
  );
}
