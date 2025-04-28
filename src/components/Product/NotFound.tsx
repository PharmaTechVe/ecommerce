'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Colors, FontSizes } from '@/styles/styles';
import Button from '@/components/Button';

export default function ProductNotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5 text-center">
      {/* Title */}
      <h1
        className="text-4xl font-bold"
        style={{
          color: Colors.primary,
          fontSize: FontSizes.h1.size,
        }}
      >
        Producto no encontrado
      </h1>

      {/* Description */}
      <p
        className="mt-4 text-sm"
        style={{
          color: Colors.textLowContrast,
          fontSize: FontSizes.b1.size,
        }}
      >
        Lo sentimos, no pudimos encontrar el producto que estás buscando.
      </p>

      {/* Go Back Button */}
      <Button onClick={handleGoBack} className="max-w-[200px]">
        Volver
      </Button>
    </div>
  );
}
