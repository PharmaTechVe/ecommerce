'use client';

import { useState, useEffect } from 'react';
import { PharmaTech } from '@pharmatech/sdk';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser, SidebarMenuItem } from '@/components/SideBar';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import RadioButton from '@/components/RadioButton';

interface User {
  id: string;
  role: string;
  isValidated: boolean;
  firstName: string;
  lastName: string;
  email: string;
  documentId: string;
  phoneNumber: string;
  lastOrderDate: Date;
  profile: {
    profilePicture: string;
    birthDate: string;
    gender: string;
  };
}

interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
}

export default function UserProfile() {
  const { token } = useAuth();
  const router = useRouter();

  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [, setIsCartOpen] = useState(false);

  const pharmaTech = PharmaTech.getInstance(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const uuid = decoded.sub;
        setUserId(uuid);

        const userData = await pharmaTech.user.getProfile(uuid, token);
        const formattedUserData: User = {
          ...userData,
          profile: {
            ...userData.profile,
            birthDate:
              userData.profile.birthDate instanceof Date
                ? userData.profile.birthDate.toISOString()
                : userData.profile.birthDate,
          },
        };
        setUser(formattedUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [token]);

  if (!user) return <div className="p-6">Cargando...</div>;

  const sidebarUser: SidebarUser = {
    name: `${user.firstName} ${user.lastName}`,
    role: user.role,
    avatar: user.profile?.profilePicture || '',
  };

  const sidebarMenu: SidebarMenuItem[] = [
    {
      id: 'profile',
      label: 'Perfil',
      href: `/usuarios/${user.id}`,
      icon: <span className="h-4 w-4 rounded-full bg-blue-400" />,
      isActive: true,
    },
  ];

  const navBarProps = {
    onCartClick: () => setIsCartOpen(true),
    onProfileClick: () => router.push(`/user/${userId}`),
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="relative z-50 bg-none">
        <NavBar {...navBarProps} />
      </div>

      <div className="flex gap-6 px-6 pt-20">
        {/* Sidebar */}
        <Sidebar user={sidebarUser} menuItems={sidebarMenu} />

        {/* Ficha de Usuario */}
        <div className="flex-1 rounded-lg bg-[#f9f9f9] p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.profile?.profilePicture || '/placeholder.svg'}
                alt="Foto de perfil"
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
              </div>
            </div>

            <Button
              variant="submit"
              width="189px"
              height="51px"
              className="font-semibold text-white"
              onClick={() => console.log('Editar perfil')}
            >
              Editar
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" value={user.firstName} disabled />
            <Input label="Apellido" value={user.lastName} disabled />
            <Input label="Correo Electrónico" value={user.email} disabled />
            <Input label="Cédula" value={user.documentId} disabled />
            <Input
              label="Fecha de nacimiento"
              value={new Date(user.profile.birthDate).toLocaleDateString()}
              disabled
              type="text"
            />
            <Input
              label="Número de teléfono"
              value={user.phoneNumber}
              disabled
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Género
            </label>
            <div className="flex gap-4">
              <RadioButton
                text="Hombre"
                selected={user.profile.gender === 'M'}
                onSelect={() => {}}
              />
              <RadioButton
                text="Mujer"
                selected={user.profile.gender === 'F'}
                onSelect={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
