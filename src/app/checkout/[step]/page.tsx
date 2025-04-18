// app/checkout/[step]/page.tsx
'use client';

import React from 'react';
import NavBar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Stepper from '@/components/Stepper';
import Button from '@/components/Button';
import ShippingInfo from './ShippingInfo';
import PaymentProcess from './PaymentProcess';
import ReviewOrder from './ReviewOrder';
import DeliveryInfo from './DeliveryInfo';
import RejectedOrder from './RejectedOrder';
import OrderSummary from '../OrderSummary';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCheckout } from '../CheckoutContext';

const CheckoutStepContent: React.FC = () => {
  const { step } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const { deliveryMethod, paymentMethod, selectedBranchLabel } = useCheckout();

  // Construcción de los títulos del stepper según método de entrega y pago
  let stepsState: string[] = [];
  if (deliveryMethod === 'store') {
    if (paymentMethod === 'pos') {
      stepsState = ['Opciones de Compra', 'Confirmación de Orden'];
    } else {
      stepsState = [
        'Opciones de Compra',
        'Visualización de Datos',
        'Confirmación de Orden',
      ];
    }
  } else if (deliveryMethod === 'home') {
    if (paymentMethod === 'pos') {
      stepsState = [
        'Opciones de Compra',
        'Confirmación de Orden',
        'Información del Repartidor',
      ];
    } else {
      stepsState = [
        'Opciones de Compra',
        'Visualización de Datos',
        'Confirmación de Orden',
        'Información del Repartidor',
      ];
    }
  }

  // Convierte el parámetro de ruta a minúsculas para switch
  const getLowerStep = (): string => {
    if (!step) return '';
    return Array.isArray(step)
      ? step[0].toLowerCase().trim()
      : step.toLowerCase().trim();
  };

  const lowerStep = getLowerStep();

  // Determina el índice actual del stepper
  const currentStepNumber = (): number => {
    if (deliveryMethod === 'store') {
      if (lowerStep === 'shippinginfo') return 1;
      if (lowerStep === 'paymentprocess') return 2;
      if (lowerStep === 'revieworder')
        return paymentMethod === 'bank' || paymentMethod === 'mobile' ? 3 : 2;
      return 0;
    }
    if (deliveryMethod === 'home') {
      if (lowerStep === 'shippinginfo') return 1;
      if (lowerStep === 'paymentprocess') return 2;
      if (lowerStep === 'revieworder') return paymentMethod === 'pos' ? 2 : 3;
      if (lowerStep === 'deliveryinfo') return paymentMethod === 'pos' ? 3 : 4;
      return 0;
    }
    return 0;
  };

  // Handlers de navegación entre pasos
  const handlePayClick = () => {
    if (!deliveryMethod || !paymentMethod || !selectedBranchLabel) {
      alert(
        'Debe seleccionar el método de retiro, la sucursal y el método de pago',
      );
      return;
    }
    if (paymentMethod === 'pos') router.push('/checkout/revieworder');
    else router.push('/checkout/paymentprocess');
  };

  const handleConfirmPayment = () => router.push('/checkout/revieworder');
  const handleAssignDelivery = () => router.push('/checkout/deliveryinfo');

  // Renderizado de cada paso
  const renderStep = () => {
    switch (lowerStep) {
      case 'shippinginfo':
        return (
          <>
            <ShippingInfo />
            <div className="mt-6 flex justify-end">
              <Button onClick={handlePayClick}>Realizar el pago</Button>
            </div>
          </>
        );
      case 'paymentprocess':
        return (
          <>
            <PaymentProcess />
            <div className="mt-6 flex justify-end">
              <Button onClick={handleConfirmPayment}>
                Confirmar Transferencia
              </Button>
            </div>
          </>
        );
      case 'revieworder':
        return (
          <>
            <ReviewOrder />
            {deliveryMethod === 'home' && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleAssignDelivery}>
                  Asignar Repartidor
                </Button>
              </div>
            )}
          </>
        );
      case 'deliveryinfo':
        return <DeliveryInfo />;
      case 'rejected':
        return <RejectedOrder />;
      default:
        return <div>El paso &quot;{step}&quot; no existe.</div>;
    }
  };

  if (!token) return null;

  // Determinar si ocultar el input de cupón: sólo oculto fuera de shippinginfo
  const hideCoupon = lowerStep !== 'shippinginfo';

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-6 text-left md:px-8">
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
            <OrderSummary hideCoupon={hideCoupon} />
          </div>
        </div>
      </main>
    </>
  );
};

export default CheckoutStepContent;
