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

export default function Page() {
  const { userData, logout } = useAuth();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  if (!userData) return <div className="p-6">Cargando...</div>;

  // Data para el Sidebar
  const sidebarUser: SidebarUser = {
    name: `${userData.firstName} ${userData.lastName}`,
    role: userData.role,
    avatar: userData.profile?.profilePicture ?? '',
  };

  // Props para la Navbar
  const navBarProps = {
    onCartClick: () => {},
    onProfileClick: () => router.push(`/user/${userData.id}`),
  };

  function handleGenderClick(genderValue: string) {
    console.log('Intento de cambiar a:', genderValue);
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* NAVBAR */}
      <div className="relative z-50">
        <NavBar {...navBarProps} />
      </div>

      {/* Botón hamburguesa en mobile */}
      {!showSidebar && (
        <button
          className="absolute left-4 top-4 z-50 md:hidden"
          onClick={() => setShowSidebar(true)}
        >
          <Bars3Icon className="h-6 w-6 text-gray-700" />
        </button>
      )}

      <div className="flex flex-col gap-6 pt-20 md:flex-row">
        {/* SIDEBAR */}
        <Sidebar
          user={sidebarUser}
          isOpen={showSidebar}
          onLogout={logout}
          className="fixed top-0 z-40 ml-[60px] h-screen md:static md:h-auto"
        >
          {/* Botón cerrar sidebar en mobile */}
          <button
            onClick={() => setShowSidebar(false)}
            className="absolute right-4 top-4 md:hidden"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </Sidebar>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1">
          <div className="mx-auto w-[956px] px-4 md:px-0">
            {/* TOP BAR */}
            <div
              className="mt-4 flex items-center justify-between rounded-[10px] px-6 py-4 shadow"
              style={{
                width: '956px',
                height: '131px',
                background: Colors.topBar,
              }}
            >
              <div className="flex items-center gap-4">
                <Avatar
                  name={`${userData.firstName} ${userData.lastName}`}
                  imageUrl={userData.profile?.profilePicture}
                  size={56}
                  withDropdown={false}
                />
                <h2 className="text-xl font-semibold text-black">
                  {userData.firstName} {userData.lastName}
                </h2>
              </div>

              <Button
                variant="submit"
                width="189px"
                height="51px"
                className="font-semibold text-white"
                onClick={() => router.push(`/user/${userData.id}/edit`)}
              >
                Editar
              </Button>
            </div>

            {/* FICHA DE USUARIO */}
            <div className="mt-6 rounded-lg p-4 md:p-6">
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
              <div className="mt-4">
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
            {/* Fin Ficha de usuario */}
          </div>
        </div>
      </div>
    </div>
  );
}
