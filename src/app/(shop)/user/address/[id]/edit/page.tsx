'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import EditAddressForm from '@/components/User/UserAddressForm';
import { api } from '@/lib/sdkConfig';
import { UserAddressResponse } from '@pharmatech/sdk';

export default function Page() {
  const { user, token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState<UserAddressResponse | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      if (user === null || token === null) {
        router.push('/login');
      }
      try {
        if (!params?.id) {
          toast.error('No se encontró la dirección.');
          router.push('/user/address');
          return;
        }
        const response = await api.userAdress.getAddress(
          user?.sub ?? '',
          params.id as string,
          token ?? '',
        );
        setInitialData(response);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        toast.error('No se pudo cargar la dirección.');
        router.push('/user/address');
      } finally {
      }
    };

    fetchData();
  }, [user?.sub, token, params?.id, router, user]);

  return (
    initialData && <EditAddressForm initialData={initialData} mode="edit" />
  );
}
