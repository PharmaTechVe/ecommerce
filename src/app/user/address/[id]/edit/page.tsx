'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';

import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';
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
  const { user, logout, token } = useAuth();
  const params = useParams();
  const router = useRouter();

  const [userData, setUserData] = useState<SidebarUser | null>(null);
  const [initialData, setInitialData] = useState<AddressFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user?.sub || !params?.id) {
      setUserData(null);
      return;
    }

    const fetchData = async () => {
      try {
        // Obtener perfil de usuario
        const profileResponse = await api.user.getProfile(user.sub, token);
        const fetchedUserData: SidebarUser = {
          name: `${profileResponse.firstName} ${profileResponse.lastName}`,
          role: profileResponse.role || 'Usuario',
          avatar: profileResponse.profile?.profilePicture || '',
        };
        setUserData(fetchedUserData);
        const response = await api.userAdress.getAddress(
          user.sub,
          params.id as string,
          token,
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
          latitude: response.latitude ?? null,
          longitude: response.longitude ?? null,
        });
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        toast.error('No se pudo cargar la dirección.');
        router.push('/user/address');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.sub, token, params?.id, router]);

  if (loading || !userData || !initialData)
    return <div className="p-6">Cargando...</div>;

  return (
    <div className="relative min-h-screen bg-white">
      {/* Navbar */}
      <div className="relative z-50">
        <NavBar onCartClick={() => {}} />
      </div>

      <div className="px-4 pt-3 md:px-8 lg:px-16">
        <UserBreadcrumbs />
      </div>

      <div className="flex gap-8 px-4 pt-16 md:px-8 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1200px] gap-8">
          <Sidebar user={userData} onLogout={logout} />
          <div className="flex-1">
            <EditAddressForm
              initialData={initialData}
              mode="edit"
              onSubmit={async (data) => {
                if (!user || !user.sub || !data.id || !token) return;
                try {
                  await api.userAdress.update(
                    user.sub,
                    initialData,
                    data.id,
                    token,
                  );
                  toast.success('Dirección actualizada');
                  router.push('/user/address');
                } catch (err) {
                  console.error('Error actualizando dirección:', err);
                  toast.error('No se pudo actualizar la dirección.');
                }
              }}
            />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
