'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';
import EditAddressForm from '@/components/User/UserAddressForm';
import { ToastContainer, toast } from 'react-toastify';
import { api } from '@/lib/sdkConfig';
import LocationPopup from '@/components/User/UserAddressPopup';

export default function Page() {
  const { user, logout, token } = useAuth();

  const [userData, setUserData] = useState<SidebarUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

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
    state: string;
    city: string;
  }) => {
    if (!user?.sub || !token || !latitude || !longitude || !selectedCityId) {
      toast.error('Faltan algunos datos necesarios para crear la dirección');
      return;
    }

    try {
      const addressData = {
        adress: data.address,
        zipCode: data.zipCode,
        additionalInformation: data.additionalInfo,
        referencePoint: data.referencePoint,
        state: data.state,
        city: data.city,
        latitude,
        longitude,
        cityId: selectedCityId,
      };

      await api.userAdress.createAddress(user.sub, addressData, token);

      toast.success('Dirección creada exitosamente');
      setShowLocationPopup(false);
    } catch (error) {
      console.error('Error creating address:', error);
      toast.error('Hubo un error al crear la dirección');
    }
  };

  const handleAddLocation = () => {
    setShowLocationPopup(true);
  };

  const handleCloseLocationPopup = () => {
    setShowLocationPopup(false);
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Navbar fija */}
      <div className="relative z-50">
        <NavBar onCartClick={() => {}} />
      </div>

      <div className="px-4 pt-3 md:px-8 lg:px-16">
        <UserBreadcrumbs />
      </div>

      <div className="flex gap-8 px-4 pt-16 md:px-8 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1200px] gap-8">
          {/* Sidebar lateral */}
          <Sidebar user={userData} onLogout={logout} />
          {/* Formulario principal en modo 'create' */}
          <div className="flex-1">
            <EditAddressForm
              mode="create"
              onCancel={handleCloseLocationPopup}
              onAdd={handleAddLocation}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      <ToastContainer />

      {/* Mostrar el popup si `showLocationPopup` es true */}
      {showLocationPopup && (
        <LocationPopup
          onAdd={(location) => {
            setLatitude(location.lat);
            setLongitude(location.lng);
            setSelectedCityId('some-city-id');
            handleCloseLocationPopup();
          }}
          onBack={handleCloseLocationPopup}
          guideText="Mueve el Pin hasta tu dirección exacta"
        />
      )}
    </div>
  );
}
