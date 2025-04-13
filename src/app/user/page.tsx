'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import EditUserForm from '@/components/User/UserProfileForm';
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
  const { user, token } = useAuth();
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

  return <EditUserForm userData={userData} isEditing={false} />;
}
