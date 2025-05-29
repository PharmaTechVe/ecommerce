'use client';
import React, { useState, useMemo } from 'react';
import Badge from '@/components/Badge';
import type { BadgeProps } from '@/components/Badge';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';
import { OrderResponse, OrderStatus } from '@pharmatech/sdk';
import { formatPrice } from '@/lib/utils/helpers/priceFormatter';

interface OrderTableProps {
  orders: OrderResponse[];
  onViewDetails: (orderId: string) => void;
}

const getBadgeProps = (
  status: OrderStatus,
): {
  label: string;
  color: BadgeProps['color'];
} => {
  switch (status) {
    case OrderStatus.REQUESTED:
      return { label: 'Pendiente', color: 'warning' };
    case OrderStatus.APPROVED:
      return { label: 'Aprobado', color: 'info' };
    case OrderStatus.IN_PROGRESS:
      return { label: 'En Progreso', color: 'primary' };
    case OrderStatus.READY_FOR_PICKUP:
      return { label: 'Listo para Retirar', color: 'info' };
    case OrderStatus.CANCELED:
      return { label: 'Cancelado', color: 'danger' };
    case OrderStatus.COMPLETED:
      return { label: 'Completado', color: 'success' };
    default:
      return { label: 'Desconocido', color: 'tertiary' };
  }
};

export default function OrderTable({ orders, onViewDetails }: OrderTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return orders.slice(start, start + itemsPerPage);
  }, [orders, currentPage]);

  const renderRow = (order: OrderResponse, isMobile: boolean) => {
    const badge = getBadgeProps(order.status);

    if (isMobile) {
      return (
        <div key={order.id} className="border-b p-4">
          <div className="mb-1 flex items-start justify-between">
            <div className="font-medium text-black">
              #{order.id.slice(0, 8)}
            </div>
            <div className="text-black">${formatPrice(order.totalPrice)}</div>
          </div>
          <div className="mb-2 text-gray-400">
            {new Date(order.createdAt).toLocaleDateString('es-Es')}
          </div>
          <div className="flex items-end justify-between">
            <Badge
              variant="filled"
              color={badge.color}
              size="large"
              borderRadius="square"
            >
              {badge.label}
            </Badge>
            <Button
              onClick={() => onViewDetails(order.id)}
              width="120px"
              height="40px"
              className="ml-2 rounded-md bg-primary px-3 py-2 text-xs text-white"
            >
              Ver detalles
            </Button>
          </div>
        </div>
      );
    }

    return (
      <tr key={order.id} className="border-b">
        <td className="px-4 py-4 text-black">#{order.id.slice(0, 8)}</td>
        <td className="px-4 py-4 text-gray-400">
          {new Date(order.createdAt).toLocaleDateString('es-Es')}
        </td>
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
