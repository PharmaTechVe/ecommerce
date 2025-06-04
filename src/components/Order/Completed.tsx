'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Colors } from '@/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import { OrderDetailedResponse } from '@pharmatech/sdk';

interface Props {
  order: OrderDetailedResponse;
}

const OrderCompleted: React.FC<Props> = ({ order }) => {
  const { user, token } = useAuth();
  const [userName, setUserName] = useState<string>('Usuario');

  useEffect(() => {
    if (user?.sub && token) {
      const fetchUserName = async () => {
        try {
          const response = await api.user.getProfile(user.sub, token);
          setUserName(response.firstName);
        } catch (error) {
          console.error('Error al obtener el nombre del usuario:', error);
        }
      };

      fetchUserName();
    }
  }, [user?.sub, token]);

  return (
    <section className="space-y-8">
      <h2
        className="text-[24px] sm:text-[24px] md:text-[40px]"
        style={{ color: Colors.textMain }}
      >
        Orden Completada
      </h2>
      <div className="flex items-center gap-4">
        <CheckCircleIcon
          className="h-[60px] w-[60px]"
          style={{ color: Colors.semanticSuccess }}
        />
        <div className="flex flex-col">
          <p
            className="text-[14px] sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            Orden #{order.id.slice(0, 8)}
          </p>
          <p
            className="text-[14px] sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            ¡Gracias por tu compra {userName}!
          </p>
        </div>
      </div>
      <p
        className="mb-4 text-[10px] sm:text-[10px] md:text-[16px]"
        style={{ color: Colors.textMain }}
      >
        Tu orden ya fue cerrada exitosamente, puedes revisar el detalle de la
        orden en la sección de Mis Pedidos.
      </p>
    </section>
  );
};

export default OrderCompleted;
