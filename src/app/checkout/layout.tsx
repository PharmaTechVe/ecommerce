// app/checkout/layout.tsx
'use client';

import React from 'react';
import { CheckoutProvider } from './CheckoutContext';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CheckoutProvider>{children}</CheckoutProvider>;
}
