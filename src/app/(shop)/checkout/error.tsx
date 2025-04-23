// app/checkout/error.tsx
'use client';

import React from 'react';

const ErrorPage: React.FC = () => {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold">¡Ha Ocurrido un Error!</h1>
        <p>Por favor, intente nuevamente o contacte soporte.</p>
      </main>
    </>
  );
};

export default ErrorPage;
