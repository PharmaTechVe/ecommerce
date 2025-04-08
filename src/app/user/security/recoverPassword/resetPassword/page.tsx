'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { resetPasswordSchema } from '@/lib/validations/recoverPasswordSchema';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import Button from '@/components/Button';
import Input from '@/components/Input/Input';
import { Colors, FontSizes } from '@/styles/styles';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';

export default function UpdatePasswordPage() {
  const { userData, logout } = useAuth();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userData) {
      toast.error('No se encontró información del usuario');
      logout();
    }
  }, [userData, router, logout]);

  const getToken = () =>
    sessionStorage.getItem('pharmatechToken') ||
    localStorage.getItem('pharmatechToken');

  const handleSubmit = async () => {
    const result = resetPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setErrors({
        newPassword: fieldErrors.newPassword?.[0] ?? '',
        confirmPassword: fieldErrors.confirmPassword?.[0] ?? '',
      });
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        toast.error('Token inválido');
        return;
      }

      setLoading(true);
      await api.auth.updatePassword(newPassword, token);
      toast.success('Contraseña actualizada correctamente');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        router.push('/user');
      }, 600);
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      toast.error('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
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
      <NavBar onCartClick={() => {}} />
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

        {/* Contenido centrado */}
        <div className="flex flex-1 justify-center px-4 md:px-0">
          <div className="w-full max-w-[620px] space-y-6 p-4 text-center md:p-6">
            <h1
              className="font-semibold"
              style={{ fontSize: FontSizes.h5.size, color: Colors.textMain }}
            >
              Cambiar Contraseña
            </h1>
            <p
              className="text-base"
              style={{ fontSize: FontSizes.b1.size, color: Colors.textMain }}
            >
              Actualiza tu contraseña para proteger la seguridad de tu cuenta
            </p>

            <div className="space-y-6 text-left">
              {/* Nueva contraseña */}
              <Input
                label="Nueva contraseña"
                placeholder="Ingresa tu nueva contraseña"
                type="password"
                showPasswordToggle={true}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                borderColor="#393938"
                borderSize="1px"
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500" role="alert">
                  {errors.newPassword}
                </p>
              )}

              {/* Confirmar contraseña */}
              <Input
                label="Confirmar contraseña"
                placeholder="Confirma tu nueva contraseña"
                type="password"
                showPasswordToggle={true}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                borderColor="#393938"
                borderSize="1px"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500" role="alert">
                  {errors.confirmPassword}
                </p>
              )}

              {/* Botón */}
              <Button
                variant="submit"
                className="mt-2 h-[46px] w-full font-semibold text-white"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
