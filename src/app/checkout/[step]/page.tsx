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

  // Define la secuencia de pasos según la combinación seleccionada.
  let stepsState: string[] = [];
  if (deliveryMethod === 'store') {
    if (paymentMethod === 'pos') {
      stepsState = ['Opciones de Compra', 'Confirmación de Orden'];
    } else if (paymentMethod === 'bank' || paymentMethod === 'mobile') {
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
    } else if (paymentMethod === 'bank' || paymentMethod === 'mobile') {
      stepsState = [
        'Opciones de Compra',
        'Visualización de Datos',
        'Confirmación de Orden',
        'Información del Repartidor',
      ];
    }
  }

  // Determina el número del paso actual según la ruta.
  const currentStepNumber = (): number => {
    const lowerStep = getLowerStep();
    if (deliveryMethod === 'store') {
      if (lowerStep === 'shippinginfo') {
        return 1;
      } else if (lowerStep === 'paymentprocess') {
        return 2;
      } else if (lowerStep === 'revieworder') {
        return paymentMethod === 'bank' || paymentMethod === 'mobile' ? 3 : 2;
      }
      return 0;
    } else if (deliveryMethod === 'home') {
      switch (lowerStep) {
        case 'shippinginfo':
          return 1;
        case 'paymentprocess':
          return 2;
        case 'revieworder':
          return paymentMethod === 'pos' ? 2 : 3;
        case 'deliveryinfo':
          return paymentMethod === 'pos' ? 3 : 4;
        case 'rejected':
          return 0;
        default:
          return 0;
      }
    }
    return 0;
  };

  const getLowerStep = (): string => {
    if (!step) return '';
    return Array.isArray(step)
      ? step[0].toLowerCase().trim()
      : step.toLowerCase().trim();
  };

  // Al presionar "Realizar el pago", se valida y se redirige según el flujo.
  const handlePayClick = () => {
    console.log(deliveryMethod, paymentMethod, selectedBranchLabel);
    if (!deliveryMethod || !paymentMethod || !selectedBranchLabel) {
      alert(
        'Debe seleccionar el método de retiro, la sucursal y el método de pago',
      );
      return;
    }

    if (deliveryMethod === 'store') {
      if (paymentMethod === 'pos') {
        router.push('/checkout/revieworder');
      } else if (paymentMethod === 'bank' || paymentMethod === 'mobile') {
        router.push('/checkout/paymentprocess');
      }
    } else if (deliveryMethod === 'home') {
      if (paymentMethod === 'pos') {
        router.push('/checkout/revieworder');
      } else if (paymentMethod === 'bank' || paymentMethod === 'mobile') {
        router.push('/checkout/paymentprocess');
      }
    } else {
      router.push('/checkout/rejected');
    }
  };

  // Confirma el pago (en PaymentProcess) y redirige a revieworder.
  const handleConfirmPayment = () => {
    router.push('/checkout/revieworder');
  };

  // En ReviewOrder, para envío a domicilio se añade un botón para avanzar a DeliveryInfo.
  const handleAssignDelivery = () => {
    router.push('/checkout/deliveryinfo');
  };

  const renderStep = () => {
    const lowerStep = getLowerStep();
    switch (lowerStep) {
      case 'shippinginfo':
        return (
          <>
            <div className="mt-8 flex flex-col gap-6 lg:flex-row">
              <div className="w-full lg:w-2/3">
                <ShippingInfo />
              </div>
              <div className="w-full lg:w-1/3">
                <OrderSummary />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handlePayClick}>Realizar el pago</Button>
            </div>
          </>
        );
      case 'paymentprocess':
        return (
          <>
            <div className="mt-8 flex flex-col gap-6 lg:flex-row">
              <div className="w-full lg:w-2/3">
                <PaymentProcess />
              </div>
              <div className="w-full lg:w-1/3">
                <OrderSummary hideCoupon />
              </div>
            </div>
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
            <ReviewOrder orderSummary={<OrderSummary hideCoupon />} />
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

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-6 text-left md:px-8">
        <div className="max-w-4xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Carrito de Compra', href: '' },
              { label: 'Checkout', href: '/checkout' },
            ]}
          />
          <div className="stepper-container">
            <Stepper
              steps={stepsState}
              currentStep={currentStepNumber()}
              stepSize={50}
              clickable={true}
            />
          </div>
        </div>
        {renderStep()}
      </main>
      <style jsx>{`
        .animate-steps {
          animation: fadeScale 0.5s ease-in-out;
        }
        @keyframes fadeScale {
          0% {
            opacity: 0.5;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0.5;
            transform: scale(0.95);
          }
        }
      `}</style>
    </>
  );
};

const CheckoutStep: React.FC = () => {
  // NOTA: Si el CheckoutProvider se coloca en un layout superior, no se envuelve aquí.
  return <CheckoutStepContent />;
};

export default CheckoutStep;
