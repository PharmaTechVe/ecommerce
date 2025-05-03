'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Stepper from '@/components/Stepper';
import Button from '@/components/Button';
import ShippingInfo from './ShippingInfo';
import PaymentProcess from './PaymentProcess';
import ReviewOrder from './ReviewOrder';
import DeliveryInfo from './DeliveryInfo';
import RejectedOrder from './RejectedOrder';
import OrderSummary from '../OrderSummary';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/sdkConfig';
import { toast } from 'react-toastify';
import { CreateOrder, OrderType, PaymentConfirmation } from '@pharmatech/sdk';

const CheckoutStepContent: React.FC = () => {
  const params = useParams<{ step: string }>();
  const step = params?.step;
  const router = useRouter();
  const { token } = useAuth();
  const { cartItems, clearCart } = useCart();

  const [orderId, setOrderId] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'store' | 'home' | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<
    'cash' | 'pos' | 'bank' | 'mobile' | null
  >(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(''); // para sucursal
  const [selectedUserAddressId, setSelectedUserAddressId] =
    useState<string>(''); // para dirección
  const [paymentConfirmationData, setPaymentConfirmationData] =
    useState<PaymentConfirmation>({} as PaymentConfirmation);
  const [isFormValid, setIsFormValid] = useState(false);

  const notify = {
    payment: (id: string) => toast.success(`Pago confirmado: ${id}`),
    order: (id: string) => toast.success(`Orden creada: ${id}`),
  };

  const isValidUUID = (id: string) =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      id,
    );

  const stepsState = [
    'Opciones de Compra',
    'Confirmación de Orden',
    'Visualización de Datos',
    'Información del Repartidor',
  ];

  const getLowerStep = (): string => {
    if (!step) return '';
    return Array.isArray(step)
      ? step[0].toLowerCase().trim()
      : step.toLowerCase().trim();
  };
  const lowerStep = getLowerStep();

  const currentStepNumber = (): number => {
    switch (lowerStep) {
      case 'shippinginfo':
        return 1;
      case 'paymentprocess':
        return 2;
      case 'revieworder':
        return 3;
      case 'deliveryinfo':
        return 4;
      default:
        return 0;
    }
  };

  const handlePayClick = async () => {
    if (!deliveryMethod || !paymentMethod) {
      alert('Debe seleccionar el método de retiro y el método de pago');
      return;
    }

    if (deliveryMethod === 'store' && !selectedBranchId) {
      alert('Por favor, selecciona una sucursal válida.');
      return;
    }

    if (deliveryMethod === 'home' && !isValidUUID(selectedUserAddressId)) {
      alert('Por favor, selecciona una dirección válida.');
      return;
    }

    const isInstant =
      (deliveryMethod === 'store' && paymentMethod === 'pos') ||
      (deliveryMethod === 'home' && paymentMethod === 'cash');

    if (isInstant) {
      const payload: CreateOrder = {
        type:
          deliveryMethod === 'store' ? OrderType.PICKUP : OrderType.DELIVERY,
        products: cartItems.map((item) => ({
          productPresentationId: item.id,
          quantity: item.quantity,
        })),
        ...(deliveryMethod === 'store'
          ? { branchId: selectedBranchId }
          : { userAddressId: selectedUserAddressId }),
      };

      try {
        const response = await api.order.create(payload, token!);
        notify.order(response.id);
        setOrderId(response.id);
        router.push('/checkout/revieworder');
      } catch (err) {
        console.error('Error al crear la orden:', err);
        alert('Ocurrió un error al crear la orden');
      }
    } else {
      router.push('/checkout/paymentprocess');
    }
  };

  const handleConfirmPayment = async () => {
    if (!isFormValid) {
      alert('Por favor, corrige los errores antes de continuar.');
      return;
    }

    try {
      const confirmation = await api.paymentConfirmation.create(
        paymentConfirmationData,
        token!,
      );
      notify.payment(confirmation.id);

      const payload: CreateOrder = {
        type:
          deliveryMethod === 'store' ? OrderType.PICKUP : OrderType.DELIVERY,
        products: cartItems.map((i) => ({
          productPresentationId: i.id,
          quantity: i.quantity,
        })),
        ...(deliveryMethod === 'store'
          ? { branchId: selectedBranchId }
          : { userAddressId: selectedUserAddressId }),
      };

      const orderRes = await api.order.create(payload, token!);
      notify.order(orderRes.id);
      setOrderId(orderRes.id);
      router.push('/checkout/revieworder');
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error procesando pago u orden.');
    }
  };

  const renderStep = () => {
    switch (lowerStep) {
      case 'shippinginfo':
        return (
          <ShippingInfo
            deliveryMethod={deliveryMethod}
            paymentMethod={
              paymentMethod === 'bank' || paymentMethod === 'mobile'
                ? paymentMethod
                : 'bank'
            }
            selectedBranchId={selectedBranchId}
            selectedBranchLabel=""
            setDeliveryMethod={setDeliveryMethod}
            setPaymentMethod={setPaymentMethod}
            setSelectedBranchId={setSelectedBranchId}
            setSelectedBranchLabel={() => {}}
            setSelectedUserAddressId={setSelectedUserAddressId}
          />
        );
      case 'paymentprocess':
        return (
          <PaymentProcess
            onValidSubmit={setIsFormValid}
            setPaymentConfirmationData={setPaymentConfirmationData}
            paymentMethod={
              paymentMethod === 'bank' || paymentMethod === 'mobile'
                ? paymentMethod
                : 'bank'
            }
            couponDiscount={0}
          />
        );
      case 'revieworder':
        return deliveryMethod ? (
          <ReviewOrder
            orderId={orderId}
            deliveryMethod={deliveryMethod}
            selectedBranchLabel=""
          />
        ) : (
          <div>Error: Método de entrega no seleccionado.</div>
        );
      case 'deliveryinfo':
        return <DeliveryInfo orderId={orderId} />;
      case 'rejected':
        return <RejectedOrder deliveryMethod={deliveryMethod || 'store'} />;
      default:
        return <div>El paso &quot;{step}&quot; no existe.</div>;
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      const timer = setTimeout(() => {
        if (cartItems.length === 0) {
          router.replace('/');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (!token) return;

    if (
      (lowerStep === 'revieworder' || lowerStep === 'deliveryinfo') &&
      !orderId
    ) {
      router.replace('/checkout/shippinginfo');
      return;
    }

    if (orderId) {
      api.order
        .getById(orderId, token)
        .then((order) => {
          const status = order.status.toUpperCase();
          if (status === 'CANCELED') {
            router.replace('/checkout/rejected');
            return;
          }
          if (status === 'COMPLETED') {
            clearCart();
            setOrderId('');
            router.replace('/');
          }
        })
        .catch((err) => console.error('Error validando orden:', err));
    }
  }, [cartItems, clearCart, token, orderId, lowerStep, router]);

  if (!token) return null;

  const hideCoupon = lowerStep !== 'shippinginfo';

  return (
    <main className="mx-auto mb-36 max-w-7xl px-4 py-6 text-left md:px-8">
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
            hideCoupon={hideCoupon}
            couponCode=""
            setCouponCode={() => {}}
            couponDiscount={0}
            setCouponDiscount={() => {}}
          />

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
  );
};

export default CheckoutStepContent;
