'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Stepper from '@/components/Stepper';
import PaymentProcess from '@/components/Order/PaymentProcess';
import ReviewOrder from '@/components/Order/ReviewOrder';
import DeliveryInfo from '@/components/Order/DeliveryInfo';
import RejectedOrder from '@/components/Order/RejectedOrder';
import OrderSummary from '@/components/Order/OrderSummary';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import { toast } from 'react-toastify';
import { OrderDetailedResponse, OrderStatus, OrderType } from '@pharmatech/sdk';
import WaitingApproval from '@/components/Order/WaitingApproval';

export default function OrderInProgress() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { token } = useAuth();
  const [order, setOrder] = useState<OrderDetailedResponse>();
  const stepsState = [
    'Opciones de Compra',
    'Confirmación de Orden',
    'Visualización de Datos',
    'Información del Repartidor',
  ];

  useEffect(() => {
    if (id && token) {
      const fetchOrder = async () => {
        try {
          const orderData = await api.order.getById(id, token);
          setOrder(orderData);
        } catch (error) {
          console.error('Error fetching order:', error);
          toast.error('Order no encontrada');
          router.push('/checkout');
        }
      };
      fetchOrder();
    }
  }, [id, token]);

  const currentStepNumber = (): number => {
    switch (order?.status) {
      case OrderStatus.APPROVED:
        return 2;
      case OrderStatus.IN_PROGRESS:
        if (order.type == OrderType.PICKUP) return 3;
        return 4;
      default:
        return 0;
    }
  };

  const renderStep = () => {
    switch (order?.status) {
      case OrderStatus.REQUESTED:
        return <WaitingApproval />;
      case OrderStatus.APPROVED:
        return <PaymentProcess order={order} couponDiscount={0} />;
      case OrderStatus.IN_PROGRESS:
        if (order?.type == OrderType.PICKUP) {
          return <ReviewOrder order={order} />;
        } else {
          return <DeliveryInfo order={order} />;
        }
      case OrderStatus.CANCELED:
        return <RejectedOrder deliveryMethod={order.type} />;
      default:
        return <div>Error</div>;
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
                { label: 'Carrito de Compra', href: '' },
                { label: 'Checkout', href: '/checkout' },
              ]}
            />
            <div className="stepper-container mb-6">
              <Stepper
                steps={stepsState}
                currentStep={currentStepNumber()}
                stepSize={50}
                clickable
              />
            </div>
          </div>
          {renderStep()}
        </div>

        <div className="w-full lg:w-1/3">
          <OrderSummary
            hideCoupon={true}
            couponCode={''}
            setCouponCode={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
