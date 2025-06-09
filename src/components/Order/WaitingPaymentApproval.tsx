'use client';

import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Colors } from '@/styles/styles';

export default function WaitingPaymentApproval() {
  return (
    <section className="space-y-8">
      <h2
        className="text-[24px] sm:text-[24px] md:text-[40px]"
        style={{ color: Colors.textMain }}
      >
        Confirmación de Pago
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
            className="text-[14px] sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            Pago en Proceso
          </p>
          <p
            className="text-[14px] sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            Estamos procesando tu pago
          </p>
        </div>
      </div>
      <p
        className="mb-4 text-[10px] sm:text-[10px] md:text-[16px]"
        style={{ color: Colors.textMain }}
      >
        En un momento actualizaremos el estado de tu orden. Si tienes alguna
        duda, por favor contacta a nuestro equipo de soporte.
      </p>
    </section>
  );
}
