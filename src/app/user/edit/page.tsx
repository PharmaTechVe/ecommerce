'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  const { userData, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
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

  const getToken = () =>
    sessionStorage.getItem('pharmatechToken') ||
    localStorage.getItem('pharmatechToken');

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
      const token = getToken();
      if (!token || typeof params.id !== 'string') {
        toast.error('Token o ID inválido');
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

      await api.user.update(params.id, payload, token);
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

  const navBarProps = {
    onCartClick: () => {},
    onProfileClick: () => router.push(`/user`),
  };

  return (
    <div className="relative min-h-screen bg-white">
      <NavBar {...navBarProps} />
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
          <div className="mx-auto w-[956px] px-4 md:px-0">
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
            </div>

            <div className="mt-6 rounded-lg p-4 md:p-6">
              <div className="grid grid-cols-1 gap-x-[48px] gap-y-[33px] md:grid-cols-2">
                <Input
                  label="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  helperText={errors.firstName}
                />
                <Input
                  label="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  helperText={errors.lastName}
                />
                <Input
                  label="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
                <Input
                  label="Cédula"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  disabled
                />
                <Input
                  label="Número de teléfono"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  helperText={errors.phoneNumber}
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
                className="h-[51px] w-[841px] font-semibold text-white"
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
