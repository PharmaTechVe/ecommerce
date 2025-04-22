// app/checkout/[step]/page.tsx
'use client';

import React, { useState } from 'react';
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
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/sdkConfig';
import { toast } from 'react-toastify';
import { CreateOrder, OrderType } from '@pharmatech/sdk';

const CheckoutStepContent: React.FC = () => {
  const { step } = useParams<{ step: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const { cartItems } = useCart();

  const {
    deliveryMethod,
    paymentMethod,
    selectedBranchLabel,
    selectedBranchId, // <-- ID de sucursal o dirección
    paymentConfirmationData,
  } = useCheckout();

  const [isFormValid, setIsFormValid] = useState(false);

  // 1. Construcción de los títulos del stepper según método de entrega y pago
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
    if (paymentMethod === 'cash') {
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

  // 2. Helper para normalizar el paso (minúsculas, trim)
  const getLowerStep = (): string => {
    if (!step) return '';
    return Array.isArray(step)
      ? step[0].toLowerCase().trim()
      : step.toLowerCase().trim();
  };
  const lowerStep = getLowerStep();

  // 3. Índice actual para el Stepper
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
      if (lowerStep === 'revieworder') return paymentMethod === 'cash' ? 2 : 3;
      if (lowerStep === 'deliveryinfo') return paymentMethod === 'cash' ? 3 : 4;
      return 0;
    }
    return 0;
  };
  // 4. Handler de “Realizar pago” con creación de orden para pickup+pos o delivery+cash
  const handlePayClick = async () => {
    if (!deliveryMethod || !paymentMethod || !selectedBranchLabel) {
      alert(
        'Debe seleccionar el método de retiro, la sucursal/dirección y el método de pago',
      );
      return;
    }

    // Sólo creamos orden para pickup+pos o delivery+cash
    const isInstant =
      (deliveryMethod === 'store' && paymentMethod === 'pos') ||
      (deliveryMethod === 'home' && paymentMethod === 'cash');

    if (isInstant) {
      // Payload tipado con CreateOrder

      const payload: CreateOrder = {
        type:
          deliveryMethod === 'store' ? OrderType.PICKUP : OrderType.DELIVERY,
        products: cartItems.map((item) => ({
          productPresentationId: item.id,
          quantity: item.quantity,
        })),
        ...(deliveryMethod === 'store'
          ? { branchId: selectedBranchId }
          : { userAddressId: selectedBranchId }),
      };

      try {
        const response = await api.order.create(payload, token!);
        toast.success(response.id || 'Orden creada correctamente');
      } catch (err) {
        console.error('Error al crear la orden:', err);
        alert('Ocurrió un error al crear la orden');
        return;
      }
      router.push('/checkout/revieworder');
    } else {
      router.push('/checkout/paymentprocess');
    }
  };

  const handleValidSubmit = (isValid: boolean) => {
    setIsFormValid(isValid); // Guardamos si el formulario es válido
  };

  const handleConfirmPayment = async () => {
    if (!isFormValid) {
      alert('Por favor, corrige los errores antes de continuar.');
      return;
    }
    if (!token) {
      alert('Debes iniciar sesión para continuar.');
      return;
    }

    try {
      // ✨ Aquí ya es un PaymentConfirmation válido
      const confirmation = await api.paymentConfirmation.create(
        paymentConfirmationData,
        token,
      );
      toast.success(`Pago confirmado: ${confirmation.id}`);

      // Creamos la orden a continuación
      const payload: CreateOrder = {
        type:
          deliveryMethod === 'store' ? OrderType.PICKUP : OrderType.DELIVERY,
        products: cartItems.map((i) => ({
          productPresentationId: i.id,
          quantity: i.quantity,
        })),
        ...(deliveryMethod === 'store'
          ? { branchId: selectedBranchId }
          : { userAddressId: selectedBranchId }),
      };
      const orderRes = await api.order.create(payload, token);
      toast.success(`Orden creada: ${orderRes.id}`);

      router.push('/checkout/revieworder');
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error procesando pago u orden.');
    }
  };

  const handleAssignDelivery = () => router.push('/checkout/deliveryinfo');

  // 5. Renderizado de cada paso
  const renderStep = () => {
    switch (lowerStep) {
      case 'shippinginfo':
        return <ShippingInfo />;
      case 'paymentprocess':
        return <PaymentProcess onValidSubmit={handleValidSubmit} />;
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
        return <RejectedOrder deliveryMethod={deliveryMethod} />;
      default:
        return <div>El paso &quot;{step}&quot; no existe.</div>;
    }
  };

  if (!token) return null;

  // 6. Decide si ocultar el cupón
  const hideCoupon = lowerStep !== 'shippinginfo';

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-6 text-left md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* IZQUIERDA */}
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

          {/* DERECHA */}
          <div className="w-full lg:w-1/3">
            <OrderSummary hideCoupon={hideCoupon} />

            {lowerStep === 'shippinginfo' && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handlePayClick}>Realizar pago</Button>
              </div>
            )}
            {lowerStep === 'paymentprocess' && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleConfirmPayment} disabled={!isFormValid}>
                  Confirmar pago
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default CheckoutStepContent;
