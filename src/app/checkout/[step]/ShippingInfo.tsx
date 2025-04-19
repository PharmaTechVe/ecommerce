'use client';

import React, { useState, useEffect } from 'react';
import { TruckIcon, CubeIcon } from '@heroicons/react/24/outline';
import Dropdown from '@/components/Dropdown';
import RadioButton from '@/components/RadioButton';
import { api } from '@/lib/sdkConfig';
import { useCheckout } from '../CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface Branch {
  id: string;
  name: string;
  city: { name: string; state: { name: string } };
}

interface UserAddressResponse {
  id: string;
  adress: string;
}

const ShippingInfo: React.FC = () => {
  const { token, user } = useAuth();
  const userId = user?.sub ?? '';
  const { cartItems } = useCart();
  const totalProducts = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const {
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
    selectedBranchLabel,
    setSelectedBranchLabel,
  } = useCheckout();

  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [addresses, setAddresses] = useState<UserAddressResponse[]>([]);
  const [localBranch, setLocalBranch] = useState<string>(
    selectedBranchLabel || '',
  );

  // Whenever deliveryMethod changes, clear dropdown and set default payment
  const handleDeliverySelection = (delivery: 'store' | 'home') => {
    setDeliveryMethod(delivery);
    setLocalBranch('');
    setSelectedBranchLabel('');
    setSelectedBranchId('');
    // default payment by delivery type
    setPaymentMethod(delivery === 'home' ? 'cash' : 'pos');
  };

  // Fetch branches when store is selected
  useEffect(() => {
    if (deliveryMethod !== 'store' || !token) return;
    (async () => {
      try {
        const res = await api.branch.findAll({ page: 1, limit: 50 }, token);
        setBranches(res.results || []);
      } catch (err) {
        console.error('Error al cargar sucursales:', err);
      }
    })();
  }, [deliveryMethod, token]);

  // Fetch user addresses when home is selected
  useEffect(() => {
    if (deliveryMethod !== 'home' || !token || !userId) return;
    (async () => {
      try {
        const list = await api.userAdress.getListAddresses(userId, token);
        setAddresses(list);
      } catch (err) {
        console.error('Error al cargar direcciones de usuario:', err);
      }
    })();
  }, [deliveryMethod, userId, token]);

  // Format items for dropdown
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

  return (
    <section className="space-y-8">
      {/* Nuevo encabezado con total de productos */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Opciones de Compra
        </h2>
        <p className="text-base text-gray-600">
          Hay {totalProducts} productos seleccionados
        </p>
      </div>

      {/* Metodo de entrega */}
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

      {/* Dropdown */}
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
              const sel = items.find((i) => i.label === value);
              setSelectedBranchId(sel?.id || '');
              setSelectedBranchLabel(value);
            }}
          />
        </div>
      </div>

      {/* Metodo de pago */}
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

      <input type="hidden" value={selectedBranchId} />
    </section>
  );
};

export default ShippingInfo;
