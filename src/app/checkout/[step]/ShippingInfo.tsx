// app/checkout/[step]/ShippingInfo.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { TruckIcon, CubeIcon } from '@heroicons/react/24/outline';
import Dropdown from '@/components/Dropdown';
import RadioButton from '@/components/RadioButton';
import { api } from '@/lib/sdkConfig';
import { useCheckout } from '../CheckoutContext';

interface Branch {
  id: string;
  name: string;
  city: {
    name: string;
    state: {
      name: string;
    };
  };
}

const ShippingInfo: React.FC = () => {
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
  const [localBranch, setLocalBranch] = useState<string>(
    selectedBranchLabel || '',
  );

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.branch.findAll({ page: 1, limit: 50 }, '');
        if (response && response.results && response.results.length > 0) {
          setBranches(response.results);
          if (selectedBranchLabel) {
            setLocalBranch(selectedBranchLabel);
          }
        }
      } catch (error) {
        console.error('Error al cargar sucursales:', error);
      }
    };

    fetchBranches();

    // Actualiza los métodos de pago dependiendo de la opción de entrega
    if (deliveryMethod === 'home') {
      setPaymentMethod('cash'); // Envío a Domicilio, se establece "Efectivo"
    } else {
      setPaymentMethod('pos'); // Retiro en Sucursal, se establece "Punto de venta"
    }
  }, [deliveryMethod, setPaymentMethod, selectedBranchLabel]);

  const formattedBranches = branches.map((b) => ({
    id: b.id,
    label: `${b.name} - ${b.city.name}, ${b.city.state.name}`,
  }));

  const handleDeliverySelection = (delivery: 'store' | 'home') => {
    setDeliveryMethod(delivery);
  };

  return (
    <section className="space-y-8">
      {/* Opciones de entrega */}
      <div className="space-y-3">
        <p className="font-medium text-gray-700">
          {deliveryMethod === 'home'
            ? 'Seleccione la dirección de entrega'
            : 'Seleccione la sucursal'}
        </p>
        <div className="flex flex-col gap-4">
          <label
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${deliveryMethod === 'store' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
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
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${deliveryMethod === 'home' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
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

      {/* Selección de dirección (Dropdown) */}
      <div>
        <p className="relative mb-2 font-medium text-gray-700">
          {deliveryMethod === 'home'
            ? 'Seleccione la dirección de entrega'
            : 'Seleccione la sucursal'}
        </p>
        <div className="relative z-50">
          <Dropdown
            label={
              deliveryMethod === 'home'
                ? localBranch
                : 'Seleccione una sucursal'
            }
            items={formattedBranches.map((b) => b.label)}
            onSelect={(value: string) => {
              setLocalBranch(value);
              const selected = formattedBranches.find((b) => b.label === value);
              setSelectedBranchId(selected?.id || '');
              setSelectedBranchLabel(value);
            }}
          />
        </div>
      </div>

      {/* Opciones de método de pago */}
      <div className="space-y-3">
        <p className="font-medium text-gray-700">
          Seleccione el método de pago
        </p>
        <div className="flex w-full flex-row flex-wrap gap-6 rounded-md border px-4 py-4">
          {deliveryMethod === 'store' && (
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
          )}

          {deliveryMethod === 'home' && (
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
