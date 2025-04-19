// src/components/Checkout/MobilePaymentForm.tsx
'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Input from '@/components/Input/Input';

interface MobilePaymentFormProps {
  onSubmit: (data: {
    bank: string;
    reference: string;
    documentNumber: string;
    phone: string;
  }) => void;
}

const MobilePaymentForm: React.FC<MobilePaymentFormProps> = ({ onSubmit }) => {
  const { cartItems } = useCart();
  const totalProducts = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [bank, setBank] = useState('');
  const [reference, setReference] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ bank, reference, documentNumber, phone });
  };

  return (
    <section className="space-y-8">
      {/* Cabecera según diseño */}
      <div className="space-y-2">
        <h2 className="text-2xl text-gray-800">Visualización de datos</h2>
        <p className="text-base text-gray-600">
          Hay {totalProducts} productos seleccionados
        </p>
        <p className="text-base text-gray-600">
          Realiza el pago en la siguiente cuenta de Pharmatech
        </p>
        <p className="text-base text-gray-500">
          Debes hacer el pago del monto exacto, de lo contrario no se creará la
          orden
        </p>
      </div>

      {/* Datos fijos de la cuenta */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <p className="text-base text-gray-500">Banco Asociado</p>
          <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
            Banco Venezuela
          </div>
        </div>
        <div>
          <p className="text-base text-gray-500">RIF</p>
          <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
            J-008720001
          </div>
        </div>
        <div>
          <p className="text-base text-gray-500">Teléfono Móvil</p>
          <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
            0424-138 00 42
          </div>
        </div>
        <div>
          <p className="text-base text-gray-500">Monto</p>
          <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
            Bs.418.67
          </div>
        </div>
      </div>

      {/* Formulario de validación */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="font-medium text-gray-700">
          Ingrese los datos para validar el pago
        </p>

        <Input
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          label="Banco"
          placeholder="Ingrese el banco"
          borderSize="1px"
          borderColor="#E7E7E6"
        />
        <Input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          label="Referencia"
          placeholder="Ingrese la referencia"
          borderSize="1px"
          borderColor="#E7E7E6"
        />
        <Input
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
          label="Número de documento"
          placeholder="Ingrese su número de documento"
          borderSize="1px"
          borderColor="#E7E7E6"
        />
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          label="Teléfono"
          placeholder="Ingrese su número de teléfono"
          borderSize="1px"
          borderColor="#E7E7E6"
        />
      </form>
    </section>
  );
};

export default MobilePaymentForm;
