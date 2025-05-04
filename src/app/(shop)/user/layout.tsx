'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import { api } from '@/lib/sdkConfig';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';

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

type UserProfileLayoutProps = {
  children: ReactNode;
};

export default function UserProfileLayout({
  children,
}: UserProfileLayoutProps) {
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
      } catch (error) {
        console.error('Error al obtener perfil:', error);
        setUserData(null);
      }
    })();
  }, [user?.sub, token]);

  if (!user?.sub || !userData) return; //<Loading />;

  const sidebarUser: SidebarUser = {
    name: `${userData.firstName} ${userData.lastName}`,
    role: userData.role ?? '',
    avatar: userData.profile?.profilePicture ?? '',
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mx-auto ml-[10%] max-w-[1440px] px-6 pt-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        <UserBreadcrumbs />
      </div>

      {/* Main layout */}
      <div className="mx-auto flex max-w-[1440px] items-start gap-8 px-6 pt-8 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        {/* Sidebar con altura fija */}
        <div className="h-[582px]">
          <Sidebar user={sidebarUser} onLogout={logout} />
        </div>

        {/* Contenido */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
