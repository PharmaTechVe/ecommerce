'use client';

import React from 'react';
import { useCheckout } from '../CheckoutContext';

const PaymentInfo: React.FC = () => {
  const { paymentMethod, setPaymentMethod } = useCheckout();

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Datos de Pago</h2>
      <p className="text-sm text-gray-600">Seleccione el método de pago.</p>
      <div className="flex flex-col gap-4">
        <button
          className={`rounded px-4 py-2 ${
            paymentMethod === 'pos' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setPaymentMethod('pos')}
        >
          Punto de Venta
        </button>
        <button
          className={`rounded px-4 py-2 ${
            paymentMethod === 'bank' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setPaymentMethod('bank')}
        >
          Transferencia Bancaria
        </button>
        <button
          className={`rounded px-4 py-2 ${
            paymentMethod === 'mobile'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200'
          }`}
          onClick={() => setPaymentMethod('mobile')}
        >
          Pago Móvil
        </button>
      </div>
    </section>
  );
};

export default PaymentInfo;
