'use client';

import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Colors } from '@/styles/styles';

export default function WaitingApproval() {
  return (
    <section className="space-y-8">
      <h2
        className="sm:text-[20px] md:text-[40px]"
        style={{ color: Colors.textMain }}
      >
        Confirmación de Orden
      </h2>
      <div className="flex items-center gap-4">
        {/* Primera columna: Ícono */}
        <div>
          <ClockIcon
            className="h-[48px] w-[48px]"
            style={{ color: Colors.semanticWarning }}
          />
        </div>
        {/* Segunda columna: Texto dividido en dos filas */}
        <div className="flex flex-col">
          <p
            className="sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            Orden En Espera
          </p>
          <p
            className="sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            Estamos procesando tu orden
          </p>
        </div>
      </div>
      <p
        className="mb-4 sm:text-[8px] md:text-[16px]"
        style={{ color: Colors.textMain }}
      >
        En un momento actualizaremos el estado de tu orden. Si tienes alguna
        duda, por favor contacta a nuestro equipo de soporte.
      </p>
    </section>
  );
}
