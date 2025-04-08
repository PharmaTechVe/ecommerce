'use client';

import React, { useState, useEffect } from 'react';
import { TruckIcon, CubeIcon } from '@heroicons/react/24/outline';
import Dropdown from '@/components/Dropdown';
import RadioButton from '@/components/RadioButton';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/sdkConfig';
import { useAuth } from '@/context/AuthContext';

interface Branch {
  id: string;
  name: string;
  address: string;
  city: {
    name: string;
    state: {
      name: string;
    };
  };
}

const CheckoutForm: React.FC = () => {
  const { token } = useAuth();
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchLabel, setSelectedBranchLabel] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pos' | 'bank' | 'mobile'>(
    'pos',
  );
  const [deliveryMethod, setDeliveryMethod] = useState<'store' | 'home'>(
    'store',
  );

  useEffect(() => {
    const fetchBranches = async () => {
      if (!token) return;
      try {
        const response = await api.branch.findAll(
          { page: 1, limit: 50 },
          token,
        );
        if (response && response.results) {
          setBranches(response.results);

          const firstBranch = response.results[0];
          const label = `${firstBranch.name} - ${firstBranch.city.name}, ${firstBranch.city.state.name}`;

          setSelectedBranchLabel(label);
          setSelectedBranchId(firstBranch.id);
        }
      } catch (error) {
        console.error('Error al cargar sucursales:', error);
      }
    };

    fetchBranches();
  }, [token]);

  const formattedBranches = branches.map((b) => ({
    id: b.id,
    label: `${b.name} - ${b.city.name}, ${b.city.state.name}`,
  }));

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Opciones de Compra
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Hay {totalItems} producto{totalItems !== 1 && 's'} seleccionad
          {totalItems !== 1 ? 'os' : 'o'}
        </p>
      </div>

      {/* Métodos de entrega */}
      <div className="space-y-3">
        <p className="font-medium text-gray-700">Opciones de Compra</p>

        <div className="flex flex-col gap-4">
          <label
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${
              deliveryMethod === 'store'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300'
            }`}
            onClick={() => setDeliveryMethod('store')}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="delivery"
                checked={deliveryMethod === 'store'}
                onChange={() => setDeliveryMethod('store')}
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
            onClick={() => setDeliveryMethod('home')}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="delivery"
                checked={deliveryMethod === 'home'}
                onChange={() => setDeliveryMethod('home')}
                className="form-radio text-blue-500"
              />
              Envío a Domicilio
            </span>
            <TruckIcon className="h-5 w-5 text-gray-500" />
          </label>
        </div>
      </div>

      {/* Sucursal */}
      <div>
        <p className="relative mb-2 font-medium text-gray-700">
          Seleccione la sucursal
        </p>
        <div className="relative z-50">
          <Dropdown
            label={selectedBranchLabel || 'Seleccione una sucursal'}
            items={formattedBranches.map((b) => b.label)}
            onSelect={(value) => {
              setSelectedBranchLabel(value);
              const selected = formattedBranches.find((b) => b.label === value);
              setSelectedBranchId(selected?.id || '');
              console.log('Sucursal seleccionada ID:', selectedBranchId);
            }}
          />
        </div>
      </div>

      {/* Método de pago */}
      <div className="space-y-3">
        <p className="font-medium text-gray-700">
          Seleccione el método de pago
        </p>
        <div className="flex w-full flex-row flex-wrap gap-6 rounded-md border px-4 py-4">
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
        </div>
      </div>

      {/* Mensaje informativo */}
      <p className="text-sm text-gray-600">
        Por favor diríjase a su sucursal más cercana y pagar en el sitio. La
        orden estará en proceso de pago hasta que pague en el sitio
      </p>
    </section>
  );
};

export default CheckoutForm;
