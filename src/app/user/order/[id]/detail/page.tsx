'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserOrderDetail from '@/components/User/Order/UserOrderDetail';
import { orderDetailsMap } from '@/lib/utils/fixtures/OrderDetail';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  checked: boolean;
}

interface OrderDetailData {
  orderNumber: string;
  products: Product[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

const typedOrderDetailsMap: Record<string, OrderDetailData> = orderDetailsMap;

export default function OrderDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? '');
  const [orderData, setOrderData] = useState<OrderDetailData | null>(null);

  useEffect(() => {
    if (id && typedOrderDetailsMap[id]) {
      setOrderData(typedOrderDetailsMap[id]);
    } else {
      setOrderData(null);
    }
  }, [id]);

  return (
    <div className="relative bg-white px-4 py-6 sm:px-6 lg:px-8">
      {orderData ? (
        <UserOrderDetail {...orderData} />
      ) : (
        <div className="mt-10 text-center text-gray-600">
          Pedido no encontrado.
        </div>
      )}
    </div>
  );
}
