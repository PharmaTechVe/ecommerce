'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import EditAddressForm from '@/components/User/UserAddressForm';
import { api } from '@/lib/sdkConfig';

type AddressFormData = {
  id: string;
  address: string;
  zipCode: string;
  additionalInformation: string;
  referencePoint: string;
  nameCity: string;
  nameState: string;
  cityId: string;
  latitude: number | null;
  longitude: number | null;
};

export default function Page() {
  const { user, token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState<AddressFormData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user === null || token === null) {
        router.push('/login');
      }
      try {
        const response = await api.userAdress.getAddress(
          user?.sub ?? '',
          params.id as string,
          token ?? '',
        );
        setInitialData({
          id: response.id,
          address: response.adress,
          zipCode: response.zipCode,
          additionalInformation: response.additionalInformation ?? '',
          referencePoint: response.referencePoint ?? '',
          nameCity: response.nameCity,
          nameState: response.nameState,
          cityId: response.cityId,
          latitude: response.latitude,
          longitude: response.longitude,
        });
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        toast.error('No se pudo cargar la dirección.');
        router.push('/user/address');
      } finally {
      }
    };

    fetchData();
  }, [user?.sub, token, params?.id, router]);

  return (
    initialData && <EditAddressForm initialData={initialData} mode="edit" />
  );
}
