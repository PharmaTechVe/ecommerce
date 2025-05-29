'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import io from 'socket.io-client';
import { SOCKET_URL } from '@/lib/socket-url';
import Breadcrumb from '@/components/Breadcrumb';
import Stepper from '@/components/Stepper';
import PaymentProcess from '@/components/Order/PaymentProcess';
import ReviewOrder from '@/components/Order/ReviewOrder';
import DeliveryInfo from '@/components/Order/DeliveryInfo';
import RejectedOrder from '@/components/Order/RejectedOrder';
import ProductOrderSummary from '@/components/Order/ProductOrderSummary';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import { toast } from 'react-toastify';
import {
  OrderDetailedResponse,
  OrderStatus,
  OrderType,
  PaymentMethod,
} from '@pharmatech/sdk';
import WaitingApproval from '@/components/Order/WaitingApproval';
import OrderCompleted from '@/components/Order/Completed';

export default function OrderInProgress() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { token } = useAuth();
  const socket = io(SOCKET_URL, {
    autoConnect: false,
    transportOptions: {
      polling: {
        extraHeaders: {
          authorization: `Bearer ${token}`,
        },
      },
    },
  });
  const [order, setOrder] = useState<OrderDetailedResponse>();
  const [orderStatus, setOrderStatus] = useState(OrderStatus.REQUESTED);

  useEffect(() => {
    function onOrderUpdated(order: { orderId: string; status: OrderStatus }) {
      setOrderStatus(order.status);
    }

    socket.connect();
    socket.on('orderUpdated', onOrderUpdated);

    return () => {
      socket.off('orderUpdated', onOrderUpdated);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (id && token) {
      api.order
        .getById(id, token)
        .then((data) => setOrder(data))
        .catch((error) => {
          console.error('Error fetching order:', error);
          toast.error('Orden no encontrada');
          router.push('/checkout');
        });
    }
  }, [id, token, router, orderStatus]);

  const steps = useMemo<string[]>(() => {
    if (!order) return ['Opciones de Compra'];

    // PICKUP
    if (order.type === OrderType.PICKUP) {
      if (order.paymentMethod === PaymentMethod.CARD) {
        return ['Opciones de Compra', 'Confirmación de Orden'];
      }
      if (
        order.paymentMethod === PaymentMethod.BANK_TRANSFER ||
        order.paymentMethod === PaymentMethod.MOBILE_PAYMENT
      ) {
        return [
          'Opciones de Compra',
          'Visualización de Datos',
          'Confirmación de Orden',
        ];
      }
    }

    // DELIVERY
    if (order.type === OrderType.DELIVERY) {
      if (order.paymentMethod === PaymentMethod.CASH) {
        return [
          'Opciones de Compra',
          'Confirmación de Orden',
          'Información del Repartidor',
        ];
      }
      if (
        order.paymentMethod === PaymentMethod.BANK_TRANSFER ||
        order.paymentMethod === PaymentMethod.MOBILE_PAYMENT
      ) {
        return [
          'Opciones de Compra',
          'Visualización de Datos',
          'Confirmación de Orden',
          'Información del Repartidor',
        ];
      }
    }

    return ['Opciones de Compra'];
  }, [order]);

  const currentStep = useMemo<number>(() => {
    if (!order) return 1;
    switch (order.status) {
      case OrderStatus.REQUESTED:
        return steps.indexOf('Confirmación de Orden') + 1;
      case OrderStatus.APPROVED:
        return steps.includes('Visualización de Datos')
          ? steps.indexOf('Visualización de Datos') + 1
          : steps.indexOf('Confirmación de Orden') + 1;
      case OrderStatus.IN_PROGRESS:
        return order.type === OrderType.PICKUP
          ? steps.indexOf('Confirmación de Orden') + 1
          : steps.indexOf('Información del Repartidor') + 1;
      case OrderStatus.CANCELED:
        return steps.indexOf('Confirmación de Orden') + 1;
      default:
        return 1;
    }
  }, [order, steps]);

  const renderStep = () => {
    if (!order) return null;
    switch (order.status) {
      case OrderStatus.REQUESTED:
        return <WaitingApproval />;
      case OrderStatus.APPROVED:
        if (
          [PaymentMethod.BANK_TRANSFER, PaymentMethod.MOBILE_PAYMENT].includes(
            order.paymentMethod,
          )
        ) {
          return <PaymentProcess order={order} couponDiscount={0} />;
        } else {
          return <ReviewOrder order={order} />;
        }
      case OrderStatus.IN_PROGRESS:
        return order.type === OrderType.PICKUP ? (
          <ReviewOrder order={order} />
        ) : (
          <DeliveryInfo order={order} />
        );
      case OrderStatus.READY_FOR_PICKUP:
        return <ReviewOrder order={order} />;
      case OrderStatus.CANCELED:
        return <RejectedOrder deliveryMethod={order.type} />;
      case OrderStatus.COMPLETED:
        return <OrderCompleted order={order} />;
    }
  };

  if (!token) return null;

  return (
    <div className="mx-auto mb-36 max-w-7xl px-4 py-6 text-left md:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-3/3 w-full">
          <div className="max-w-4xl">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Mis Pedidos', href: '/user/order' },
                {
                  label: `#${order?.id.slice(0, 8)}`,
                  href: `/order/${order?.id}`,
                },
              ]}
            />
            <div className="stepper-container mb-6">
              <Stepper
                steps={steps}
                currentStep={currentStep}
                stepSize={50}
                clickable
              />
            </div>
          </div>
          {renderStep()}
        </div>

        <div className="w-full lg:w-1/3">
          {order && <ProductOrderSummary order={order} />}
        </div>
      </div>
    </div>
  );
}
