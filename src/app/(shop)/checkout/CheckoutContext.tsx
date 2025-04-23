// src/app/checkout/CheckoutContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

  couponCode: string;
  setCouponCode: (code: string) => void;
  couponDiscount: number;
  setCouponDiscount: (amount: number) => void;

  paymentConfirmationData: PaymentConfirmation;
  setPaymentConfirmationData: (data: PaymentConfirmation) => void;

  orderId: string;
  setOrderId: (id: string) => void;
}

const CheckoutContext = createContext<CheckoutState | null>(null);

// Iniciales vacíos pero completos
const INITIAL_PAYMENT_CONFIRMATION: PaymentConfirmation = {
  bank: '',
  reference: '',
  documentId: '',
  phoneNumber: '',
};

// Helpers para leer del storage (siempre en cliente)
const getLS = (key: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  return localStorage.getItem(key) ?? fallback;
};

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 1️⃣ Lee el deliveryMethod de storage, o 'store' si no existe
  const [deliveryMethod, setDeliveryMethodState] = useState<'store' | 'home'>(
    () => getLS('deliveryMethod', 'store') as 'store' | 'home',
  );
  // 2️⃣ Lee el paymentMethod o 'pos'
  const [paymentMethod, setPaymentMethodState] = useState<
    'pos' | 'cash' | 'bank' | 'mobile'
  >(() => getLS('paymentMethod', 'pos') as 'pos' | 'cash' | 'bank' | 'mobile');
  // 3️⃣ Lee la sucursal/dirección seleccionada
  const [selectedBranchLabel, setSelectedBranchLabelState] = useState<string>(
    () => getLS('selectedBranchLabel', ''),
  );
  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(() =>
    getLS('selectedBranchId', ''),
  );
  // 4️⃣ Otros (cupón, confirmación, orderId)
  const [couponCode, setCouponCode] = useState<string>(() =>
    getLS('couponCode', ''),
  );
  const [couponDiscount, setCouponDiscount] = useState<number>(() => {
    const v = getLS('couponDiscount', '0');
    return parseFloat(v) || 0;
  });

  const [paymentConfirmationData, setPaymentConfirmationData] =
    useState<PaymentConfirmation>(INITIAL_PAYMENT_CONFIRMATION);

  const [orderId, setOrderId] = useState<string>(() => getLS('orderId', ''));

  // 📌 Cada vez que cambie, guardamos en LS:
  useEffect(() => {
    localStorage.setItem('deliveryMethod', deliveryMethod);
  }, [deliveryMethod]);
  useEffect(() => {
    localStorage.setItem('paymentMethod', paymentMethod);
  }, [paymentMethod]);
  useEffect(() => {
    localStorage.setItem('selectedBranchLabel', selectedBranchLabel);
  }, [selectedBranchLabel]);
  useEffect(() => {
    localStorage.setItem('selectedBranchId', selectedBranchId);
  }, [selectedBranchId]);
  useEffect(() => {
    localStorage.setItem('couponCode', couponCode);
  }, [couponCode]);
  useEffect(() => {
    localStorage.setItem('couponDiscount', couponDiscount.toString());
  }, [couponDiscount]);
  useEffect(() => {
    localStorage.setItem('orderId', orderId);
  }, [orderId]);

  // Envuelve los setters para exponer en contexto:
  const setDeliveryMethod = (m: 'store' | 'home') => setDeliveryMethodState(m);
  const setPaymentMethod = (m: 'pos' | 'cash' | 'bank' | 'mobile') =>
    setPaymentMethodState(m);
  const setSelectedBranchLabel = (l: string) => setSelectedBranchLabelState(l);
  const setSelectedBranchId = (id: string) => setSelectedBranchIdState(id);

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
        couponCode,
        setCouponCode,
        couponDiscount,
        setCouponDiscount,
        paymentConfirmationData,
        setPaymentConfirmationData,
        orderId,
        setOrderId,
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
