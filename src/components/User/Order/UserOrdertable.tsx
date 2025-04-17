'use client';
import React, { useState, useMemo } from 'react';
import Badge from '@/components/Badge';
import type { BadgeProps } from '@/components/Badge';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
//import { FontSizes } from '@/styles/styles';
//import { api } from '@/lib/sdkConfig';

export type OrderStatus = 'pendiente' | 'pagado' | 'entregado';

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  totalPrice: number;
}

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
}

const getBadgeProps = (
  status: OrderStatus,
): {
  label: string;
  color: BadgeProps['color'];
} => {
  const map = {
    pendiente: { label: 'Pendiente', color: 'danger' },
    pagado: { label: 'Pagado', color: 'tertiary' },
    entregado: { label: 'Entregado', color: 'success' },
  } as const;

  return map[status];
};

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

export default function OrderTable({ orders, onViewDetails }: OrderTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return orders.slice(start, start + itemsPerPage);
  }, [orders, currentPage]);

  const renderRow = (order: Order, isMobile: boolean) => {
    const badge = getBadgeProps(order.status);

    if (isMobile) {
      return (
        <div key={order.id} className="border-b p-4">
          <div className="mb-1 flex items-start justify-between">
            <div className="font-medium text-black">{order.orderNumber}</div>
            <div className="text-black">{formatPrice(order.totalPrice)}</div>
          </div>
          <div className="mb-2 text-gray-400">{order.orderDate}</div>
          <div className="flex items-end justify-between">
            <Badge
              variant="filled"
              color={badge.color}
              size="small"
              borderRadius="square"
            >
              {badge.label}
            </Badge>
            <Button
              onClick={() => onViewDetails(order.id)}
              width="120px"
              height="40px"
              className="rounded-md bg-primary px-3 py-2 text-xs text-white"
            >
              Ver detalles
            </Button>
          </div>
        </div>
      );
    }

    return (
      <tr key={order.id} className="border-b">
        <td className="px-4 py-4 text-black">{order.orderNumber}</td>
        <td className="px-4 py-4 text-gray-400">{order.orderDate}</td>
        <td className="px-4 py-4">
          <Badge
            variant="filled"
            color={badge.color}
            size="large"
            borderRadius="square"
          >
            {badge.label}
          </Badge>
        </td>
        <td className="px-4 py-4 text-black">
          {formatPrice(order.totalPrice)}
        </td>
        <td className="px-4 py-4">
          <Button
            onClick={() => onViewDetails(order.id)}
            width="120px"
            height="37px"
            className="rounded-md bg-primary px-3 py-1 text-xs text-white"
          >
            Ver detalles
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <div className="h-auto w-full max-w-[942px] rounded-md bg-white">
      {/* Tabla Desktop */}
      <div className="hidden overflow-auto md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-4 text-left font-medium text-gray-700">
                Número de Orden
              </th>
              <th className="px-4 py-4 text-left font-medium text-gray-700">
                Fecha del Pedido
              </th>
              <th className="px-4 py-4 text-left font-medium text-gray-700">
                Estatus
              </th>
              <th className="px-4 py-4 text-left font-medium text-gray-700">
                Precio Total
              </th>
              <th className="px-4 py-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => renderRow(order, false))}
          </tbody>
        </table>
      </div>

      {/* Tabla Mobile */}
      <div className="md:hidden">
        {paginatedOrders.map((order) => renderRow(order, true))}
      </div>

      {/* Paginación */}
      {orders.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={orders.length}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
