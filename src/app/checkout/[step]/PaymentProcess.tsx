'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '../CheckoutContext';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';

const PaymentProcess: React.FC = () => {
  const { paymentMethod, couponDiscount } = useCheckout();
  const { cartItems } = useCart();
  const router = useRouter();

  const totalProducts = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Calculations for displaying total amount
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const itemDiscount = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.discount ? item.price * item.quantity * (item.discount / 100) : 0),
    0,
  );
  const tax = (subtotal - itemDiscount - couponDiscount) * 0.16;
  const totalAmount =
    subtotal - itemDiscount - couponDiscount + (tax > 0 ? tax : 0);

  // Form state
  const [bank, setBank] = useState('');
  const [reference, setReference] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { bank, reference, documentNumber, phone };
    console.log('Payment validation data:', data);
    router.push('/checkout/ReviewOrder');
  };

  // Determine form type
  const isBank = paymentMethod === 'bank';

  // Dynamic description
  const description = isBank
    ? 'Debes hacer el pago del monto exacto, la orden se creará cuando se confirme el pago'
    : 'Debes hacer el pago del monto exacto, de lo contrario no se creará la orden';

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl text-gray-800">
          {isBank ? 'Transferencia Bancaria' : 'Pago Móvil'}
        </h2>
        <p className="text-base text-gray-600">
          Hay {totalProducts} productos seleccionados
        </p>
        <p className="text-base text-gray-600">
          Realiza el pago en la siguiente cuenta de Pharmatech
        </p>
        <p className="text-base text-gray-500">{description}</p>
      </div>

      {/* Fixed account data */}
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
        {isBank ? (
          <div>
            <p className="text-base text-gray-500">Nº de Cuenta</p>
            <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
              0134-2452-30-2536432346
            </div>
          </div>
        ) : (
          <div>
            <p className="text-base text-gray-500">Teléfono Móvil</p>
            <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
              0424-138 00 42
            </div>
          </div>
        )}
        <div>
          <p className="text-base text-gray-500">Monto</p>
          <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
            Bs.{totalAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Validation form */}
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
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Continuar
        </button>
      </form>
    </section>
  );
};

export default PaymentProcess;
