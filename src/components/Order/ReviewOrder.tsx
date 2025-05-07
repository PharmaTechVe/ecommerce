'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Colors } from '@/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import { OrderDetailedResponse, OrderType } from '@pharmatech/sdk';
import GoogleMaps, { BranchMarker } from '../GoogleMap/GoogleMap';

interface Props {
  order: OrderDetailedResponse;
}

const ReviewOrder: React.FC<Props> = ({ order }) => {
  const { user, token } = useAuth();
  const [userName, setUserName] = useState<string>('Usuario');

  const isStorePickup = order.type === OrderType.PICKUP;

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

  const mapCenter = useMemo(() => {
    const { latitude, longitude } = order.branch!;
    return { lat: latitude ?? 10.0653, lng: longitude ?? -69.3235 };
  }, [order]);

  const markers: BranchMarker[] = [
    {
      id: order.branch?.id || '',
      name: order.branch?.name || '',
      latitude: order.branch?.latitude || 0,
      longitude: order.branch?.longitude || 0,
      address: order.branch?.address || '',
    },
  ];

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
            Orden #{order.id.slice(0, 8)}
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
              Sucursal de retiro: {order.branch?.name}
            </p>
            <GoogleMaps
              markers={markers}
              center={mapCenter}
              mapWidth="100%"
              mapHeight="600px"
              zoom={16}
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
