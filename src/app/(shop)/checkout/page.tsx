'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TruckIcon, CubeIcon } from '@heroicons/react/24/outline';
import Dropdown from '@/components/Dropdown';
import RadioButton from '@/components/RadioButton';
import {
  BranchResponse,
  CreateOrder,
  OrderType,
  UserAddressResponse,
  PaymentMethod,
} from '@pharmatech/sdk';
import { api } from '@/lib/sdkConfig';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/styles/styles';
import { useCart } from '@/context/CartContext';
import Breadcrumb from '@/components/Breadcrumb';
import Stepper from '@/components/Stepper';
import OrderSummary from '@/components/Order/OrderSummary';
import Button from '@/components/Button';
import { toast } from 'react-toastify';

const ShippingInfo: React.FC = () => {
  const router = useRouter();
  const { token, user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const userId = user?.sub ?? '';
  const [deliveryMethod, setDeliveryMethod] = useState<'store' | 'home' | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<
    'cash' | 'pos' | 'bank' | 'mobile'
  >('cash');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedUserAddressId, setSelectedUserAddressId] =
    useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [addresses, setAddresses] = useState<UserAddressResponse[]>([]);
  const [localBranch, setLocalBranch] = useState<string>('');
  const totalProducts = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const steps = useMemo(() => {
    if (!deliveryMethod) {
      return ['Opciones de Compra'];
    }
    if (deliveryMethod === 'store') {
      if (paymentMethod === 'pos') {
        return ['Opciones de Compra', 'Confirmación de Orden'];
      }
      return [
        'Opciones de Compra',
        'Visualización de Datos',
        'Confirmación de Orden',
      ];
    }
    // home delivery
    if (paymentMethod === 'cash') {
      return [
        'Opciones de Compra',
        'Confirmación de Orden',
        'Información del Repartidor',
      ];
    }
    return [
      'Opciones de Compra',
      'Visualización de Datos',
      'Confirmación de Orden',
      'Información del Repartidor',
    ];
  }, [deliveryMethod, paymentMethod]);

  const paymentMethodMap: Record<
    'cash' | 'pos' | 'bank' | 'mobile',
    PaymentMethod
  > = {
    cash: PaymentMethod.CASH,
    pos: PaymentMethod.CARD,
    bank: PaymentMethod.BANK_TRANSFER,
    mobile: PaymentMethod.MOBILE_PAYMENT,
  };

  const handleDeliverySelection = (delivery: 'store' | 'home') => {
    setDeliveryMethod(delivery);
    setLocalBranch('');
    setSelectedBranchId('');
    setSelectedUserAddressId('');
    setPaymentMethod(delivery === 'home' ? 'cash' : 'pos');
  };

  const isValidUUID = (id: string) =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      id,
    );

  useEffect(() => {
    if (deliveryMethod === 'store') {
      api.branch
        .findAll({ page: 1, limit: 50 })
        .then((res) => setBranches(res.results || []))
        .catch(console.error);
    }
  }, [deliveryMethod]);

  useEffect(() => {
    if (deliveryMethod === 'home' && token && userId) {
      api.userAdress
        .getListAddresses(userId, token)
        .then(setAddresses)
        .catch(console.error);
    }
  }, [deliveryMethod, token, userId]);

  const formattedBranches = branches.map((b) => ({
    id: b.id,
    label: `${b.name} - ${b.city.name}, ${b.city.state.name}`,
  }));

  const formattedAddresses = addresses.map((a) => ({
    id: a.id,
    label: a.adress,
  }));

  const items =
    deliveryMethod === 'home' ? formattedAddresses : formattedBranches;
  const sectionLabel =
    deliveryMethod === 'home'
      ? 'Seleccione la dirección de entrega'
      : 'Seleccione la sucursal';

  const dropdownPlaceholder =
    deliveryMethod === 'home'
      ? 'Seleccione dirección'
      : 'Seleccione una sucursal';

  const handlePayClick = async () => {
    if (!deliveryMethod || !paymentMethod) {
      toast.error('Debe seleccionar el método de retiro y el método de pago');
      return;
    }

    if (deliveryMethod === 'store' && !selectedBranchId) {
      toast.error('Por favor, selecciona una sucursal válida.');
      return;
    }

    if (deliveryMethod === 'home' && !isValidUUID(selectedUserAddressId)) {
      toast.error('Por favor, selecciona una dirección válida.');
      return;
    }

    const payload: CreateOrder = {
      type: deliveryMethod === 'store' ? OrderType.PICKUP : OrderType.DELIVERY,
      products: cartItems.map((item) => ({
        productPresentationId: item.id,
        quantity: item.quantity,
      })),
      paymentMethod: paymentMethodMap[paymentMethod],
      ...(deliveryMethod === 'store'
        ? { branchId: selectedBranchId }
        : { userAddressId: selectedUserAddressId }),
      ...(couponCode ? { couponCode } : {}),
    };

    try {
      const response = await api.order.create(payload, token!);
      toast.success(`Orden creada: ${response.id.slice(0, 8)}`);
      clearCart();
      router.push(`/order/${response.id}`);
    } catch (err) {
      console.error('Error al crear la orden:', err);
      toast.error('Ocurrió un error al crear la orden');
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
              <Stepper steps={steps} currentStep={1} stepSize={50} clickable />
            </div>
          </div>
          <section className="space-y-8">
            <h2
              className="sm:text-[20px] md:text-[40px]"
              style={{ color: Colors.textMain }}
            >
              Opciones de compra
            </h2>
            <p className="text-base text-gray-600">
              Hay {totalProducts} productos seleccionados
            </p>

            <div className="space-y-3">
              <p className="font-medium text-gray-700">{sectionLabel}</p>
              <div className="flex flex-col gap-4">
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${
                    deliveryMethod === 'store'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onClick={() => handleDeliverySelection('store')}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'store'}
                      onChange={() => handleDeliverySelection('store')}
                      className="form-radio text-blue-500"
                    />
                    Retiro en Sucursal
                  </span>
                  <CubeIcon className="h-5 w-5 text-gray-500" />
                </label>
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${
                    deliveryMethod === 'home'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onClick={() => handleDeliverySelection('home')}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'home'}
                      onChange={() => handleDeliverySelection('home')}
                      className="form-radio text-blue-500"
                    />
                    Envío a Domicilio
                  </span>
                  <TruckIcon className="h-5 w-5 text-gray-500" />
                </label>
              </div>
            </div>

            <div>
              <p className="relative mb-2 font-medium text-gray-700">
                {sectionLabel}
              </p>
              <div className="relative z-50">
                <Dropdown
                  key={deliveryMethod}
                  label={localBranch || dropdownPlaceholder}
                  items={items.map((i) => i.label)}
                  onSelect={(value) => {
                    setLocalBranch(value);
                    const found = items.find((i) => i.label === value);
                    if (deliveryMethod === 'home') {
                      setSelectedUserAddressId(found?.id || '');
                    } else {
                      setSelectedBranchId(found?.id || '');
                    }
                  }}
                />
              </div>
              {deliveryMethod === 'home' && (
                <p
                  className="mt-2 cursor-pointer hover:underline"
                  style={{ color: Colors.primary }}
                  onClick={() => router.push('/user/address/new')}
                >
                  Agregar nueva dirección
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className="font-medium text-gray-700">
                Seleccione el método de pago
              </p>
              <div className="flex flex-wrap gap-6 rounded-md border px-4 py-4">
                {deliveryMethod === 'store' ? (
                  <>
                    <RadioButton
                      text="Punto de venta"
                      selected={paymentMethod === 'pos'}
                      onSelect={() => setPaymentMethod('pos')}
                    />
                    <RadioButton
                      text="Transferencia Bancaria"
                      selected={paymentMethod === 'bank'}
                      onSelect={() => setPaymentMethod('bank')}
                    />
                    <RadioButton
                      text="Pago Móvil"
                      selected={paymentMethod === 'mobile'}
                      onSelect={() => setPaymentMethod('mobile')}
                    />
                  </>
                ) : (
                  <>
                    <RadioButton
                      text="Efectivo"
                      selected={paymentMethod === 'cash'}
                      onSelect={() => setPaymentMethod('cash')}
                    />
                    <RadioButton
                      text="Transferencia Bancaria"
                      selected={paymentMethod === 'bank'}
                      onSelect={() => setPaymentMethod('bank')}
                    />
                    <RadioButton
                      text="Pago Móvil"
                      selected={paymentMethod === 'mobile'}
                      onSelect={() => setPaymentMethod('mobile')}
                    />
                  </>
                )}
              </div>
            </div>

            <div>
              {deliveryMethod === 'store' && paymentMethod === 'pos' && (
                <p className="text-[#6E6D6C]">
                  Por favor dirigirse a su sucursal más cercana y pagar en el
                  sitio. La orden estará en proceso de pago hasta que pague en
                  el sitio
                </p>
              )}
              {deliveryMethod === 'home' && paymentMethod === 'cash' && (
                <p className="text-[#6E6D6C]">
                  Debe pagar al personal del delivery la cantidad exacta de su
                  pedido. La orden estará en proceso de pago hasta que pague en
                  el sitio
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="w-full lg:w-1/3">
          <OrderSummary
            hideCoupon={false}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
          />
          <div className="mt-6 flex justify-end">
            <Button onClick={handlePayClick}>Realizar pago</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
