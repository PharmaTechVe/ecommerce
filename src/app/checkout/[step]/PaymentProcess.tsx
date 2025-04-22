'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '../CheckoutContext';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import { api } from '@/lib/sdkConfig';
import { PaymentInfoResponse } from '@pharmatech/sdk';

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

  const [paymentDetails, setPaymentDetails] =
    useState<PaymentInfoResponse | null>(null);

  useEffect(() => {
    const fetchPaymentMethodDetails = async () => {
      try {
        let response: PaymentInfoResponse | undefined;
        let id: string | undefined;

        //El design contempla una sola info para transferencia y una para pago movil por lo que hardcodee el id
        if (paymentMethod === 'bank') {
          id = '7c9eb7fb-1c4f-417c-a878-37c266f9f6ce';
        } else if (paymentMethod === 'mobile') {
          id = '2f09bf3d-bdd9-49be-9d6c-27230a96ffe5';
        }

        if (id) {
          response = await api.paymentInformation.getById(id);
        }

        if (response) {
          setPaymentDetails(response);
        }
      } catch (error) {
        console.error('Error fetching payment method details:', error);
      }
    };

    fetchPaymentMethodDetails();
  }, [paymentMethod]);

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
            {paymentDetails?.bank}
          </div>
        </div>
        <div>
          <p className="text-base text-gray-500">RIF</p>
          <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
            {paymentDetails?.documentId}
          </div>
        </div>
        {isBank ? (
          <div>
            <p className="text-base text-gray-500">Nº de Cuenta</p>
            <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
              {paymentDetails?.account}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-base text-gray-500">Teléfono Móvil</p>
            <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
              {paymentDetails?.phoneNumber}
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
      </form>
    </section>
  );
};

export default PaymentProcess;
