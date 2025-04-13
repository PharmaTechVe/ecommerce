'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';
import EditUserForm from '@/components/User/UserProfileForm';
import { ToastContainer } from 'react-toastify';
import { api } from '@/lib/sdkConfig';

enum UserGender {
  MALE = 'm',
  FEMALE = 'f',
}

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  documentId: string;
  phoneNumber: string;
  role?: string;
  profile: {
    birthDate: string | Date;
    gender: UserGender;
    profilePicture?: string;
  };
};

export default function Page() {
  const { user, logout, token } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user?.sub || !token) {
      setUserData(null);
      return;
    }

    (async () => {
      try {
        const response = await api.user.getProfile(user.sub, token);
        const profileResponse: UserProfile = {
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          documentId: response.documentId,
          phoneNumber: response.phoneNumber,
          role: response.role,
          profile: {
            birthDate: response.profile?.birthDate,
            gender:
              response.profile?.gender === 'm'
                ? UserGender.MALE
                : UserGender.FEMALE,
            profilePicture: response.profile?.profilePicture,
          },
        };

        setUserData(profileResponse);
        console.log('Perfil obtenido:', profileResponse);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
        setUserData(null);
      }
    })();
  }, [user?.sub, token]);

  if (!user?.sub || !userData) return <div className="p-6">Cargando...</div>;

  const sidebarUser: SidebarUser = {
    name: `${userData.firstName} ${userData.lastName}`,
    role: userData.role ?? '',
    avatar: userData.profile?.profilePicture ?? '',
  };

  return (
    <div className="relative min-h-screen bg-white">
      <div className="relative z-50">
        <NavBar onCartClick={() => {}} />
      </div>

      <div className="px-4 pt-6 md:px-8 lg:px-16">
        <UserBreadcrumbs />
      </div>

      <div className="flex gap-8 px-4 pt-8 md:px-8 lg:px-16">
        <Sidebar user={sidebarUser} onLogout={logout} />
        <div className="flex-1">
          <EditUserForm userData={userData} isEditing={false} />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
