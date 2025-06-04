'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ClipboardIcon } from '@heroicons/react/24/outline';
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
import { formatPrice } from '@/lib/utils/helpers/priceFormatter';
import copyToClipboard from '@/lib/utils/helpers/clipboard';

type Errors = {
  bank?: string;
  reference?: string;
  documentId?: string;
  phoneNumber?: string;
};

type Props = {
  order: OrderDetailedResponse;
  setOrder: (order: OrderDetailedResponse) => void;
  couponDiscount: number;
};

const PaymentProcess: React.FC<Props> = ({ order, setOrder }) => {
  const { token } = useAuth();
  const totalProducts = order.details.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

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
    (field: keyof Omit<PaymentConfirmation, 'orderId'>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPaymentConfirmationData({
        ...paymentConfirmation,
        [field]: e.target.value,
      });
    };

  const handleSubmit = useCallback(async () => {
    setErrors({});

    const payload: PaymentConfirmation = {
      ...paymentConfirmation,
      orderId: order.id,
    };

    const result = checkoutPaymentProcessSchema.safeParse(payload);

    if (result.success) {
      try {
        await api.paymentConfirmation.create(paymentConfirmation, token!);
        toast.success(
          'El pago ha sido confirmado, por favor espera a que se procese la orden',
        );
        const orderPayed = await api.order.getById(order.id, token!);
        setOrder(orderPayed);
      } catch (error) {
        console.error('Error al confirmar pago:', error);
      }
    } else {
      setErrors({
        bank: result.error.formErrors.fieldErrors.bank?.[0],
        reference: result.error.formErrors.fieldErrors.reference?.[0],
        documentId: result.error.formErrors.fieldErrors.documentId?.[0],
        phoneNumber: result.error.formErrors.fieldErrors.phoneNumber?.[0],
      });
    }
  }, [paymentConfirmation, order.id, token]);

  const isBank = order.paymentMethod === PaymentMethod.BANK_TRANSFER;

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

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
        <div>
          <p className="text-base text-gray-500">Banco Asociado</p>
          <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
            {paymentDetails?.bank}
          </div>
        </div>
        <div>
          <p className="text-base text-gray-500">RIF</p>
          <div className="mt-1 flex items-center justify-between rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
            {paymentDetails?.documentId}
            <button
              type="button"
              onClick={() => copyToClipboard(paymentDetails?.documentId)}
              className="ml-1"
              title="Copiar RIF"
            >
              <ClipboardIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>
        {isBank ? (
          <div>
            <p className="text-base text-gray-500">Nº de Cuenta</p>
            <div className="mt-1 flex items-center justify-between rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
              {paymentDetails?.account}
              <button
                type="button"
                onClick={() => copyToClipboard(paymentDetails?.account)}
                className="ml-1"
                title="Copiar cuenta"
              >
                <ClipboardIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-base text-gray-500">Teléfono Móvil</p>
            <div className="mt-1 flex items-center justify-between rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
              {paymentDetails?.phoneNumber}
              <button
                type="button"
                onClick={() => copyToClipboard(paymentDetails?.phoneNumber)}
                className="ml-1"
                title="Copiar teléfono"
              >
                <ClipboardIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>
        )}
        <div>
          <p className="text-base text-gray-500">Monto</p>
          <div className="mt-1 rounded-md bg-gray-200 px-3 py-2 text-base text-gray-700">
            ${formatPrice(order.totalPrice)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="font-medium text-gray-700">
          Ingrese los datos para validar el pago
        </p>
        <Dropdown
          label="Banco"
          items={banks}
          onSelect={(value) => {
            setSelectedBank(value);
            setPaymentConfirmationData({
              ...paymentConfirmation,
              bank: value,
            });
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
          onClick={handleSubmit}
        >
          Enviar Referencia
        </Button>
      </div>
    </section>
  );
};

export default PaymentProcess;
