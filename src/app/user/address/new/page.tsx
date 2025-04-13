'use client';

import { useAuth } from '@/context/AuthContext';
import EditAddressForm from '@/components/User/UserAddressForm';
import { api } from '@/lib/sdkConfig';
import { toast } from 'react-toastify';

export default function Page() {
  const { user, token } = useAuth();

  const handleSubmit = async (data: {
    address: string;
    zipCode: string;
    additionalInfo: string;
    referencePoint: string;
    cityId: string;
    latitude: number;
    longitude: number;
  }) => {
    if (!user?.sub || !token) {
      toast.error('Sesión inválida. Inicia sesión nuevamente.');
      return;
    }

    try {
      const addressData = {
        adress: data.address,
        zipCode: data.zipCode,
        additionalInformation: data.additionalInfo,
        referencePoint: data.referencePoint,
        latitude: data.latitude,
        longitude: data.longitude,
        cityId: data.cityId,
      };

      await api.userAdress.createAddress(user.sub, addressData, token);
      toast.success('Dirección creada exitosamente');
    } catch (error) {
      console.error('Error creando dirección:', error);
      toast.error('Hubo un error al crear la dirección');
    }
  };

  return <EditAddressForm mode="create" onSubmit={handleSubmit} />;
}
