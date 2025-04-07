'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import {
  Bars3Icon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { updatePasswordSchema } from '@/lib/validations/updatePasswordSchema';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import Button from '@/components/Button';
import Link from 'next/link';
import { Colors, FontSizes } from '@/styles/styles';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';

export default function UpdatePasswordPage() {
  const { userData, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [showSidebar, setShowSidebar] = useState(false);

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [showPass3, setShowPass3] = useState(false);

  useEffect(() => {
    if (!userData) {
      toast.error('No se encontró información del usuario');
      router.push('/login');
    }
  }, [userData, router]);

  const getToken = () =>
    sessionStorage.getItem('pharmatechToken') ||
    localStorage.getItem('pharmatechToken');

  const handleSubmit = async () => {
    const result = updatePasswordSchema.safeParse({
      password,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setErrors({
        password: fieldErrors.password?.[0] ?? '',
        newPassword: fieldErrors.newPassword?.[0] ?? '',
        confirmPassword: fieldErrors.confirmPassword?.[0] ?? '',
      });
      return;
    }

    try {
      const token = getToken();
      if (!token || typeof params.id !== 'string') {
        toast.error('Token o ID inválido');
        return;
      }

      await api.auth.updatePassword(newPassword, token);
      toast.success('Contraseña actualizada correctamente');

      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      router.push(`/user`);
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      toast.error('Error al actualizar la contraseña');
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
              Cambia tu contraseña para proteger la seguridad de tu cuenta
            </p>

            {/* Formulario */}
            <div className="space-y-6 text-left">
              {/* Contraseña actual */}
              <div>
                <label
                  htmlFor="current-password"
                  className="mb-1 block"
                  style={{
                    fontSize: FontSizes.b1.size,
                    color: Colors.textMain,
                  }}
                >
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showPass1 ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-[46px] w-full rounded-md border border-gray-100 px-4 pr-12 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass1(!showPass1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass1 ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Nueva contraseña */}
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-1 block"
                  style={{
                    fontSize: FontSizes.b1.size,
                    color: Colors.textMain,
                  }}
                >
                  Contraseña Nueva
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPass2 ? 'text' : 'password'}
                    placeholder="Ingresa tu nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-[46px] w-full rounded-md border border-gray-100 px-4 pr-12 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass2(!showPass2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass2 ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.newPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1 block"
                  style={{
                    fontSize: FontSizes.b1.size,
                    color: Colors.textMain,
                  }}
                >
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showPass3 ? 'text' : 'password'}
                    placeholder="Confirma tu nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-[46px] w-full rounded-md border border-gray-100 px-4 pr-12 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass3(!showPass3)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass3 ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* ¿Olvidaste tu contraseña? */}
              <p className="text-sm">
                ¿Olvidaste tu contraseña?{' '}
                <Link
                  href={`/user/security/recoverPassword`}
                  style={{ color: Colors.secondaryLight }}
                >
                  Haz click aquí
                </Link>
              </p>

              {/* Botón */}
              <Button
                variant="submit"
                className="mt-2 h-[46px] w-full font-semibold text-white"
                onClick={handleSubmit}
              >
                Cambiar Contraseña
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
