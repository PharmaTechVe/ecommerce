'use client';

import React, { createContext, useContext, useState } from 'react';

interface CheckoutState {
  deliveryMethod: 'store' | 'home';
  setDeliveryMethod: (method: 'store' | 'home') => void;
  paymentMethod: 'pos' | 'cash' | 'bank' | 'mobile';
  setPaymentMethod: (method: 'pos' | 'cash' | 'bank' | 'mobile') => void;
  selectedBranchLabel: string;
  setSelectedBranchLabel: (label: string) => void;
  // Nueva variable para almacenar la secuencia de pasos
  stepSequence: string[] | null;
  setStepSequence: (steps: string[]) => void;
}

const CheckoutContext = createContext<CheckoutState | null>(null);

export const CheckoutProvider: React.FC<
  React.PropsWithChildren<Record<string, unknown>>
> = ({ children }) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'store' | 'home'>(
    'store',
  );
  const [paymentMethod, setPaymentMethod] = useState<
    'pos' | 'cash' | 'bank' | 'mobile'
  >('pos');
  const [selectedBranchLabel, setSelectedBranchLabel] = useState<string>('');
  const [stepSequence, setStepSequence] = useState<string[] | null>(null);

  return (
    <CheckoutContext.Provider
      value={{
        deliveryMethod,
        setDeliveryMethod,
        paymentMethod,
        setPaymentMethod,
        selectedBranchLabel,
        setSelectedBranchLabel,
        stepSequence,
        setStepSequence,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === null) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
