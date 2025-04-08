'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import Breadcrumb from '@/components/Breadcrumb';
import Stepper from '@/components/Stepper';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  if (!token) {
    return null; // opcional: podrías mostrar un loader
  }

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-6 text-left md:px-8">
        <div className="max-w-4xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Carrito de Compra', href: '' },
              { label: 'Checkout', href: '/checkout' },
            ]}
          />
          <Stepper
            steps={['Opciones de compra', 'Confirmación de orden']}
            currentStep={1}
            stepSize={50}
            clickable={true}
          />
        </div>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-2/3">
            <CheckoutForm />
          </div>
          <div className="w-full lg:w-1/3">
            <OrderSummary />
          </div>
        </div>
      </main>
    </>
  );
};

export default CheckoutPage;
