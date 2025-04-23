'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext'; // ◀️ importa tu contexto de carrito

const CheckoutPage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { cartItems } = useCart(); // ◀️ extrae los items

  useEffect(() => {
    // 1) Si no está autenticado, al login
    if (!token) {
      router.replace('/login');
      return;
    }

    // 2) Si el carrito está vacío, al Home
    if (cartItems.length === 0) {
      router.replace('/');
      return;
    }

    // 3) En caso contrario, al primer paso de checkout
    router.replace('/checkout/shippinginfo');
  }, [token, cartItems, router]);

  return null;
};

export default CheckoutPage;
