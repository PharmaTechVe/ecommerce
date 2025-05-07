'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Input from '@/components/Input/Input';
import { api } from '@/lib/sdkConfig';
import {
  PaymentInfoResponse,
  PaymentConfirmation,
  OrderDetailedResponse,
  PaymentMethod,
} from '@pharmatech/sdk';
import { checkoutPaymentProcessSchema } from '@/lib/validations/checkoutPaymentProcessSchema';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import Dropdown from '../Dropdown';
import { toast } from 'react-toastify';

type Errors = {
  bank?: string;
  reference?: string;
  documentId?: string;
  phoneNumber?: string;
};

type Props = {
  order: OrderDetailedResponse;
  couponDiscount: number;
};

const PaymentProcess: React.FC<Props> = ({ order, couponDiscount }) => {
  const { token } = useAuth();
  const totalProducts = order.details.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const subtotal = order.details.reduce(
    (acc, item) => acc + item.productPresentation.price * item.quantity,
    0,
  );
  const itemDiscount = order.details.reduce(
    (acc, item) =>
      acc +
      (item.productPresentation.promo?.discount
        ? item.productPresentation.price *
          item.quantity *
          (item.productPresentation.promo.discount / 100)
        : 0),
    0,
  );
  const tax = (subtotal - itemDiscount - couponDiscount) * 0.16;
  const totalAmount =
    subtotal - itemDiscount - couponDiscount + (tax > 0 ? tax : 0);
  const [banks, setBanks] = useState<string[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [paymentConfirmation, setPaymentConfirmationData] =
    useState<PaymentConfirmation>({
      bank: selectedBank,
      reference: '',
      documentId: '',
      phoneNumber: '',
      orderId: order.id,
    });
  const [errors, setErrors] = useState<Errors>({});

  const handleOnChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setPaymentConfirmationData({
        ...paymentConfirmation,
        [field]: e.target.value,
      });
      setErrors({ ...errors, [field]: '' });
    };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});

      const result =
        checkoutPaymentProcessSchema.safeParse(paymentConfirmation);

      if (result.success) {
        try {
          await api.paymentConfirmation.create(paymentConfirmation, token!);
          toast.success(
            'El pago ha sido confirmado, por favor espera a que se procese la orden',
          );
        } catch (error) {
          console.error('Error confirming payment:', error);
        }
      } else {
        setErrors({
          bank: result.error.formErrors.fieldErrors.bank?.[0],
          reference: result.error.formErrors.fieldErrors.reference?.[0],
          documentId: result.error.formErrors.fieldErrors.documentId?.[0],
          phoneNumber: result.error.formErrors.fieldErrors.phoneNumber?.[0],
        });
      }
    },
    [paymentConfirmation],
  );

  const isBank = false; //paymentMethod === 'bank';

  const description = isBank
    ? 'Debes hacer el pago del monto exacto, la orden se creará cuando se confirme el pago'
    : 'Debes hacer el pago del monto exacto, de lo contrario no se creará la orden';

  const [paymentDetails, setPaymentDetails] =
    useState<PaymentInfoResponse | null>(null);

  useEffect(() => {
    const fetchPaymentMethodDetails = async () => {
      try {
        const response = await api.paymentInformation.findAll(
          PaymentMethod.MOBILE_PAYMENT,
        );
        setPaymentDetails(response[0]);
      } catch (error) {
        console.error('Error fetching payment method details:', error);
      }
    };
    const fetchBanks = async () => {
      try {
        const response = await api.bank.findAll();
        setBanks(response);
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };
    fetchBanks();
    fetchPaymentMethodDetails();
  }, []);

  return (
    <section className="space-y-8">
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="font-medium text-gray-700">
          Ingrese los datos para validar el pago
        </p>
        <Dropdown
          label="Banco"
          items={banks.map((i) => i)}
          onSelect={(value) => {
            setSelectedBank(value);
            setPaymentConfirmationData({ ...paymentConfirmation, bank: value });
          }}
        />
        {errors.bank && <p className="text-xs text-red-500">{errors.bank}</p>}

        <Input
          value={paymentConfirmation.reference}
          onChange={handleOnChange('reference')}
          label="Referencia"
          placeholder="Ingrese la referencia"
          borderSize="1px"
          borderColor="#E7E7E6"
        />
        {errors.reference && (
          <p className="text-xs text-red-500">{errors.reference}</p>
        )}

        <Input
          value={paymentConfirmation.documentId}
          onChange={handleOnChange('documentId')}
          label="Número de documento"
          placeholder="Ingrese su número de documento"
          borderSize="1px"
          borderColor="#E7E7E6"
        />
        {errors.documentId && (
          <p className="text-xs text-red-500">{errors.documentId}</p>
        )}

        <Input
          value={paymentConfirmation.phoneNumber}
          onChange={handleOnChange('phoneNumber')}
          label="Teléfono"
          placeholder="Ingrese su número de teléfono"
          borderSize="1px"
          borderColor="#E7E7E6"
        />
        {errors.phoneNumber && (
          <p className="text-xs text-red-500">{errors.phoneNumber}</p>
        )}
        <Button
          variant="submit"
          className="w-full rounded-md bg-[#1C2143] px-7 py-2 text-[16px] text-white hover:opacity-60"
        >
          Confirmar
        </Button>
      </form>
    </section>
  );
};

export default PaymentProcess;
