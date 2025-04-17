// app/checkout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const CheckoutPage = () => {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    } else {
      // Redirige al primer paso, por ejemplo, ShippingInfo
      router.replace('/checkout/ShippingInfo');
    }
  }, [token, router]);

  return null;
};

export default CheckoutPage;
