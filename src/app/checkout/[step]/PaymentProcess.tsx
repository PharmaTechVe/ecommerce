// app/checkout/[step]/PaymentProcess.tsx
'use client';

import React from 'react';
import { useCheckout } from '../CheckoutContext';
import { useRouter } from 'next/navigation';

import BankTransferForm from '@/components/Checkout/BankTransferForm';
import MobilePaymentForm from '@/components/Checkout/MobilePaymentForm';

const PaymentProcess: React.FC = () => {
  const { deliveryMethod, paymentMethod } = useCheckout();
  const router = useRouter();

  // generic submit handler for both forms
  const handleSubmit = (data: {
    bank: string;
    reference: string;
    documentNumber: string;
    phone: string;
  }) => {
    console.log('Payment validation data:', data);
    router.push('/checkout/revieworder');
  };

  // decide which form to render
  if (deliveryMethod === 'store' && paymentMethod === 'bank') {
    return <BankTransferForm onSubmit={handleSubmit} />;
  }
  if (deliveryMethod === 'store' && paymentMethod === 'mobile') {
    return <MobilePaymentForm onSubmit={handleSubmit} />;
  }
  if (deliveryMethod === 'home' && paymentMethod === 'bank') {
    return <BankTransferForm onSubmit={handleSubmit} />;
  }
  if (deliveryMethod === 'home' && paymentMethod === 'mobile') {
    return <MobilePaymentForm onSubmit={handleSubmit} />;
  }

  return null;
};

export default PaymentProcess;
