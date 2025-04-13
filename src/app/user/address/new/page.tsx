'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';
import EditAddressForm from '@/components/User/UserAddressForm';
import { ToastContainer, toast } from 'react-toastify';
import { api } from '@/lib/sdkConfig';

const LocationPopup = dynamic(
  () => import('@/components/GoogleMap/UserAddressPopup'),
  {
    ssr: false,
    loading: () => <div className="p-6">Cargando mapa...</div>,
  },
);

export default function Page() {
  const { user, logout, token } = useAuth();

  const [userData, setUserData] = useState<SidebarUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  useEffect(() => {
    if (!token || !user?.sub) {
      setUserData(null);
      return;
    }

    (async () => {
      try {
        const profileResponse = await api.user.getProfile(user.sub, token);
        const fetchedUserData: SidebarUser = {
          name: `${profileResponse.firstName} ${profileResponse.lastName}`,
          role: profileResponse.role || 'Usuario',
          avatar: profileResponse.profile?.profilePicture || '',
        };
        setUserData(fetchedUserData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setUserData(null);
        setLoading(false);
      }
    })();
  }, [user?.sub, token]);

  if (loading || !userData) return <div className="p-6">Cargando...</div>;

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
      setShowLocationPopup(false);
    } catch (error) {
      console.error('Error creando dirección:', error);
      toast.error('Hubo un error al crear la dirección');
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
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
              mode="create"
              onAdd={() => setShowLocationPopup(true)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      <ToastContainer />

      {showLocationPopup && (
        <LocationPopup
          onAdd={() => setShowLocationPopup(false)}
          onBack={() => setShowLocationPopup(false)}
          guideText="Mueve el Pin hasta tu dirección exacta"
        />
      )}
    </div>
  );
}
