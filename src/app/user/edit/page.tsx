'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { editUserSchema } from '@/lib/validations/editSchema';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Avatar from '@/components/Avatar';
import { Colors } from '@/styles/styles';
import { toast, ToastContainer } from 'react-toastify';
import { api } from '@/lib/sdkConfig';
import DatePicker1 from '@/components/Calendar';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';

enum UserGender {
  MALE = 'm',
  FEMALE = 'f',
}

function formatBirthDate(rawDate: unknown): string {
  if (typeof rawDate === 'string') {
    const parts = rawDate.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return rawDate;
  }
  if (rawDate instanceof Date) {
    return rawDate.toISOString().slice(0, 10);
  }
  return '';
}

export default function EditUserPage() {
  const { userData, logout, token } = useAuth();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<UserGender>(UserGender.MALE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      setDocumentId(userData.documentId);
      setPhoneNumber(userData.phoneNumber ?? '');
      setBirthDate(formatBirthDate(userData.profile?.birthDate));
      setGender(userData.profile?.gender as UserGender);
    }
  }, [userData]);

  const handleSubmit = async () => {
    const result = editUserSchema.safeParse({
      firstName,
      lastName,
      email,
      documentId,
      phoneNumber,
      birthDate,
      gender,
    });

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setErrors({
        firstName: fieldErrors.firstName?.[0] ?? '',
        lastName: fieldErrors.lastName?.[0] ?? '',
        email: fieldErrors.email?.[0] ?? '',
        documentId: fieldErrors.documentId?.[0] ?? '',
        phoneNumber: fieldErrors.phoneNumber?.[0] ?? '',
        birthDate: fieldErrors.birthDate?.[0] ?? '',
        gender: fieldErrors.gender?.[0] ?? '',
      });
      return;
    }

    try {
      if (!token || !userData?.id) {
        console.error('Token o ID de usuario inválido');
        return;
      }

      const payload = {
        firstName,
        lastName,
        email,
        documentId,
        phoneNumber: phoneNumber.trim() === '' ? undefined : phoneNumber,
        birthDate,
        gender,
      };

      await api.user.update(userData.id, payload, token);
      toast.success('Perfil actualizado correctamente');
      router.push(`/user`);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  if (!userData) return <div className="p-6">Cargando...</div>;

  const sidebarUser: SidebarUser = {
    name: `${userData.firstName} ${userData.lastName}`,
    role: userData.role,
    avatar: userData.profile?.profilePicture ?? '',
  };

  return (
    <div className="relative min-h-screen bg-white">
      <NavBar />
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

      <div className="flex flex-col gap-6 pt-20 md:flex-row">
        <Sidebar
          user={sidebarUser}
          isOpen={showSidebar}
          onLogout={logout}
          className="fixed top-0 z-40 ml-[60px] h-screen md:static md:h-auto"
        >
          <button
            onClick={() => setShowSidebar(false)}
            className="absolute right-4 top-4 md:hidden"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </Sidebar>

        <div className="flex-1">
          <div className="mx-auto w-full max-w-[956px] px-4 md:px-0">
            {/* TOPBAR con Avatar + Semicírculo + Badge */}
            <div
              className="relative flex flex-col items-center justify-center rounded-[10px] px-6 py-10 shadow md:flex-row md:justify-between md:py-4"
              style={{
                background: Colors.topBar,
              }}
            >
              {/* Semicírculo blanco solo en mobile */}
              <div className="absolute bottom-0 left-1/2 z-0 h-28 w-24 -translate-x-1/2 translate-y-1/2 rounded-full bg-white md:hidden" />

              {/* Avatar + Badge */}
              <div className="relative z-10 -mb-[100px] md:static md:mb-0 md:flex md:items-center md:gap-4">
                <div className="relative w-fit">
                  {/* Avatar */}
                  <Avatar
                    name={`${userData.firstName} ${userData.lastName}`}
                    imageUrl={userData.profile?.profilePicture}
                    size={80}
                    withDropdown={false}
                  />
                  {/* Badge (siempre visible) */}
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
                </div>

                {/* Nombre solo visible en desktop */}
                <h2 className="hidden text-xl font-semibold text-black md:block">
                  {userData.firstName} {userData.lastName}
                </h2>
              </div>
            </div>

            {/* FORMULARIO */}
            <div className="mt-14 rounded-lg p-4 md:p-6">
              <div className="grid grid-cols-1 gap-x-[48px] gap-y-[33px] md:grid-cols-2">
                <Input
                  label="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  helperText={errors.firstName}
                  borderColor="#f3f4f6"
                />
                <Input
                  label="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  helperText={errors.lastName}
                  borderColor="#f3f4f6"
                />
                <Input
                  label="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  borderColor="#f3f4f6"
                />
                <Input
                  label="Cédula"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  disabled
                  borderColor="#f3f4f6"
                />
                <Input
                  label="Número de teléfono"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  helperText={errors.phoneNumber}
                  borderColor="#f3f4f6"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Fecha de nacimiento
                </label>
                <DatePicker1 onDateSelect={(date) => setBirthDate(date)} />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.birthDate}
                  </p>
                )}
              </div>

              <div className="mt-4 pb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Género
                </label>
                <div className="flex gap-4">
                  <RadioButton
                    text="Hombre"
                    selected={gender === UserGender.MALE}
                    onSelect={() => setGender(UserGender.MALE)}
                  />
                  <RadioButton
                    text="Mujer"
                    selected={gender === UserGender.FEMALE}
                    onSelect={() => setGender(UserGender.FEMALE)}
                  />
                </div>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                )}
              </div>

              <Button
                variant="submit"
                className="h-[51px] w-full font-semibold text-white"
                onClick={handleSubmit}
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
