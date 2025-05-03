'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Colors } from '@/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';

interface Props {
  deliveryMethod: 'store' | 'home';
  selectedBranchLabel: string;
  orderId: string;
}

const ReviewOrder: React.FC<Props> = ({
  deliveryMethod,
  selectedBranchLabel,
  orderId,
}) => {
  const { user, token } = useAuth();
  const [orderNumber, setOrderNumber] = useState<string>(orderId || '');
  const [userName, setUserName] = useState<string>('Usuario');

  const isStorePickup = deliveryMethod === 'store';

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

  useEffect(() => {
    if (orderId && token) {
      api.order
        .getById(orderId, token)
        .then((ord) => setOrderNumber(ord.id))
        .catch(console.error);
    }
  }, [orderId, token]);

  return (
    <section className="space-y-8">
      <h2
        className="sm:text-[20px] md:text-[40px]"
        style={{ color: Colors.textMain }}
      >
        Confirmación de Orden
      </h2>
      <div className="flex items-center gap-4">
        <CheckCircleIcon
          className="h-[60px] w-[60px]"
          style={{ color: Colors.semanticSuccess }}
        />
        <div className="flex flex-col">
          <p
            className="sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            Orden #{orderNumber || '...'}
          </p>
          <p
            className="sm:text-[14px] md:text-[28px]"
            style={{ color: Colors.textMain }}
          >
            ¡Gracias por tu compra {userName}!
          </p>
        </div>
      </div>
      <p
        className="mb-4 sm:text-[8px] md:text-[16px]"
        style={{ color: Colors.textMain }}
      >
        Tu pedido ya está listo para que pases por él en la sucursal indicada.
        En el mapa adjunto podrás ver la ubicación exacta para que llegues sin
        problemas.
      </p>

      {isStorePickup ? (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full lg:w-2/3">
            <p
              className="mb-2 mt-2 sm:text-[8px] md:text-[16px]"
              style={{ color: Colors.textMain }}
            >
              Sucursal de retiro: {selectedBranchLabel}
            </p>
            <Image
              src="/images/mapa.jpg"
              alt="Mapa"
              width={600}
              height={400}
              className="rounded-md border"
            />
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-700">
          Revisión de la Orden completada.
        </div>
      )}
    </section>
  );
};

export default ReviewOrder;
