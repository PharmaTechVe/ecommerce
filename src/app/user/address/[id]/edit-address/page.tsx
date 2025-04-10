'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';
import EditAddressForm from '@/components/User/UserAddressForm';
import { ToastContainer } from 'react-toastify';
import { api } from '@/lib/sdkConfig';

export default function Page() {
  const { user, logout, token } = useAuth();

  const [userData, setUserData] = useState<SidebarUser | null>(null);
  const [loading, setLoading] = useState(true);

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
          {/* Formulario principal */}
          <div className="flex-1">
            <EditAddressForm />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
