// /pages/checkout/success.tsx
import React from 'react';
import NavBar from '@/components/Navbar';

const SuccessPage: React.FC = () => {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold">¡Compra Exitosa!</h1>
        <p>Gracias por su compra. Su orden ha sido procesada correctamente.</p>
      </main>
    </>
  );
};

export default SuccessPage;
