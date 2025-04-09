'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import Avatar from '@/components/Avatar';
import { Colors } from '@/styles/styles';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';
import EditForm from '@/components/User/UserProfileForm';
import { ToastContainer } from 'react-toastify';

function formatFechaFromAny(value: unknown): string {
  const raw =
    typeof value === 'string'
      ? value
      : value instanceof Date
        ? value.toISOString().split('T')[0]
        : '';

  if (!raw) return '';

  const [year, month, day] = raw.split('-');
  return `${day}-${month}-${year}`;
}

export default function Page() {
  const { userData, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!userData) return <div className="p-6">Cargando...</div>;

  const sidebarUser: SidebarUser = {
    name: `${userData.firstName} ${userData.lastName}`,
    role: userData.role,
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
          <div
            className="relative mx-auto flex w-full flex-col items-center justify-center rounded-[10px] px-6 pb-20 pt-10 shadow md:flex-row md:justify-between md:py-4"
            style={{ maxWidth: '956px', background: Colors.topBar }}
          >
            <div className="absolute -bottom-7 left-1/2 z-0 h-24 w-24 -translate-x-1/2 rounded-full bg-white md:hidden" />

            <div className="relative z-10 -mb-[120px] md:static md:mb-0 md:flex md:items-center md:gap-4">
              <div className="relative w-fit">
                <Avatar
                  name={`${userData.firstName} ${userData.lastName}`}
                  imageUrl={userData.profile?.profilePicture}
                  size={80}
                  withDropdown={false}
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-0 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-[#2D397B]">
                    <svg
                      width="15"
                      height="19"
                      viewBox="0 0 15 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.40974 16.5121L13.8218 13.529M5.44435 5.18871L11.3094 14.9138M7.88488 3.45702C7.97384 3.60685 7.91605 3.80123 7.75579 3.8912L2.89534 6.6196C2.73508 6.70956 2.53304 6.66103 2.44407 6.5112C0.438238 3.13329 1.74333 1.84064 2.90922 1.18617C4.07511 0.531702 5.87569 0.0734776 7.88488 3.45702ZM8.04596 3.72831L13.739 13.3157C13.8083 13.4324 13.842 13.5661 13.8346 13.7008C13.7407 15.3999 13.5009 16.8887 13.3418 17.7344C13.2662 18.1358 12.8503 18.3715 12.454 18.2369C11.6172 17.9527 10.1627 17.416 8.59372 16.6428C8.46993 16.5818 8.3675 16.4865 8.29812 16.3697L2.60516 6.78248L8.04596 3.72831Z"
                        stroke="white"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <h2 className="hidden text-xl font-semibold text-black md:block">
                {userData.firstName} {userData.lastName}
              </h2>
            </div>

            {!isEditing && (
              <div className="hidden md:block">
                <Button
                  variant="submit"
                  width="189px"
                  height="51px"
                  className="font-semibold text-white"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <EditForm onCancel={() => setIsEditing(false)} />
          ) : (
            <div className="mx-auto mt-14 w-full max-w-[956px] rounded-lg p-4 md:p-6">
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
                  value={formatFechaFromAny(userData.profile.birthDate)}
                  disabled
                  type="text"
                />
                <Input
                  label="Número de teléfono"
                  value={userData.phoneNumber}
                  disabled
                />
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Género
                </label>
                <div className="flex gap-4">
                  <RadioButton
                    text="Hombre"
                    selected={userData.profile.gender === 'm'}
                    onSelect={() => {}}
                    disabled
                  />
                  <RadioButton
                    text="Mujer"
                    selected={userData.profile.gender === 'f'}
                    onSelect={() => {}}
                    disabled
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
