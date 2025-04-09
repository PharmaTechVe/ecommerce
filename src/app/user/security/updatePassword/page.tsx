'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { Bars3Icon } from '@heroicons/react/24/outline';

import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';
import { Colors, FontSizes } from '@/styles/styles';
import UserPasswordForm from '@/components/User/UserPasswordForm';

export default function UpdatePasswordPage() {
  const { userData, logout } = useAuth();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!userData) {
      toast.error('No se encontró información del usuario');
      router.push('/login');
    }
  }, [userData, router]);

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
        <Sidebar user={sidebarUser} onLogout={logout} />

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

            <UserPasswordForm />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
