// src/app/checkout/CheckoutContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import { PaymentConfirmation } from '@pharmatech/sdk';

interface CheckoutState {
  deliveryMethod: 'store' | 'home';
  setDeliveryMethod: (method: 'store' | 'home') => void;

  paymentMethod: 'pos' | 'cash' | 'bank' | 'mobile';
  setPaymentMethod: (method: 'pos' | 'cash' | 'bank' | 'mobile') => void;

  selectedBranchLabel: string;
  setSelectedBranchLabel: (label: string) => void;

  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;

  stepSequence: string[] | null;
  setStepSequence: (steps: string[]) => void;

  couponCode: string;
  setCouponCode: (code: string) => void;
  couponDiscount: number;
  setCouponDiscount: (amount: number) => void;

  // ahora siempre es un objeto completo, nunca Partial ni null
  paymentConfirmationData: PaymentConfirmation;
  setPaymentConfirmationData: (data: PaymentConfirmation) => void;
}

const CheckoutContext = createContext<CheckoutState | null>(null);

// Valores iniciales “vacíos” pero completos
const INITIAL_PAYMENT_CONFIRMATION: PaymentConfirmation = {
  bank: '',
  reference: '',
  documentId: '',
  phoneNumber: '',
};

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'store' | 'home'>(
    'store',
  );
  const [paymentMethod, setPaymentMethod] = useState<
    'pos' | 'cash' | 'bank' | 'mobile'
  >('pos');
  const [selectedBranchLabel, setSelectedBranchLabel] = useState<string>('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [stepSequence, setStepSequence] = useState<string[] | null>(null);

  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Estado ya tipado como completo
  const [paymentConfirmationData, setPaymentConfirmationData] =
    useState<PaymentConfirmation>(INITIAL_PAYMENT_CONFIRMATION);

  return (
    <CheckoutContext.Provider
      value={{
        deliveryMethod,
        setDeliveryMethod,
        paymentMethod,
        setPaymentMethod,
        selectedBranchLabel,
        setSelectedBranchLabel,
        selectedBranchId,
        setSelectedBranchId,
        stepSequence,
        setStepSequence,
        couponCode,
        setCouponCode,
        couponDiscount,
        setCouponDiscount,
        paymentConfirmationData,
        setPaymentConfirmationData,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
};
