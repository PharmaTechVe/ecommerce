'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import RadioButton from '@/components/RadioButton';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Avatar from '@/components/Avatar';
import { Colors } from '@/styles/styles';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';

export default function Page() {
  const { userData, logout } = useAuth();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  if (!userData) return <div className="p-6">Cargando...</div>;

  const sidebarUser: SidebarUser = {
    name: `${userData.firstName} ${userData.lastName}`,
    role: userData.role,
    avatar: userData.profile?.profilePicture ?? '',
  };

  const handleGenderClick = (genderValue: string) => {
    console.log('Intento de cambiar a:', genderValue);
  };

  return (
    <div className="relative min-h-screen bg-white">
      <div className="relative z-50">
        <NavBar onCartClick={() => {}} />
      </div>

      <div className="px-4 pt-3 md:px-8 lg:px-16">
        <UserBreadcrumbs />
      </div>

      {!showSidebar && (
        <button
          className="absolute left-4 top-4 z-50 md:hidden"
          onClick={() => setShowSidebar(true)}
        >
          <Bars3Icon className="h-6 w-6 text-gray-700" />
        </button>
      )}

      <div className="flex gap-8 px-4 pt-16 md:px-8 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1200px] gap-8">
          <Sidebar
            user={sidebarUser}
            isOpen={showSidebar}
            onLogout={logout}
            className="w-72"
          >
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute right-4 top-4 md:hidden"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </Sidebar>

          <div className="flex-1">
            {/* TOP BAR */}

            <div
              className="relative flex w-full flex-col items-center justify-center rounded-[10px] px-6 pb-20 pt-10 shadow md:flex-row md:justify-between md:py-4"
              style={{ maxWidth: '956px', background: Colors.topBar }}
            >
              {/* Semicírculo blanco solo visible en mobile */}
              <div className="absolute -bottom-7 left-1/2 z-0 h-24 w-24 -translate-x-1/2 rounded-full bg-white md:hidden" />

              {/* Avatar encajado en el semicírculo */}
              <div className="z-10 -mb-[120px] md:static md:mb-0 md:flex md:items-center md:gap-4">
                <Avatar
                  name={`${userData.firstName} ${userData.lastName}`}
                  imageUrl={userData.profile?.profilePicture}
                  size={80}
                  withDropdown={false}
                />
                <h2 className="hidden text-xl font-semibold text-black md:block">
                  {userData.firstName} {userData.lastName}
                </h2>
              </div>

              {/* Botón solo en desktop */}
              <div className="hidden md:block">
                <Button
                  variant="submit"
                  width="189px"
                  height="51px"
                  className="font-semibold text-white"
                  onClick={() => router.push(`/user/edit`)}
                >
                  Editar
                </Button>
              </div>
            </div>
            {/* Ficha del usuario */}
            <div className="mt-14 max-w-[956px] rounded-lg p-4 md:p-6">
              <div className="grid grid-cols-1 gap-x-[48px] gap-y-[33px] md:grid-cols-2">
                <Input label="Nombre" value={userData.firstName} disabled />
                <Input label="Apellido" value={userData.lastName} disabled />
                <Input
                  label="Correo Electrónico"
                  value={userData.email}
                  disabled
                />
                <Input label="Cédula" value={userData.documentId} disabled />
                <Input
                  label="Fecha de nacimiento"
                  value={new Date(
                    userData.profile.birthDate,
                  ).toLocaleDateString()}
                  disabled
                  type="text"
                />
                <Input
                  label="Número de teléfono"
                  value={userData.phoneNumber}
                  disabled
                />
              </div>

              {/* Género */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Género
                </label>
                <div className="flex gap-4">
                  <RadioButton
                    text="Hombre"
                    selected={userData.profile.gender === 'm'}
                    onSelect={() => handleGenderClick('m')}
                    disabled
                  />
                  <RadioButton
                    text="Mujer"
                    selected={userData.profile.gender === 'f'}
                    onSelect={() => handleGenderClick('f')}
                    disabled
                  />
                </div>
              </div>
            </div>
            {/* Fin ficha usuario */}
          </div>
        </div>
      </div>
    </div>
  );
}
