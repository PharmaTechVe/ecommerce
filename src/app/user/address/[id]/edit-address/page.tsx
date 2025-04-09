'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Navbar';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import { Bars3Icon } from '@heroicons/react/24/outline';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';
import EditForm from '@/components/User/editUserAddressForm';
import { ToastContainer } from 'react-toastify';

export default function Page() {
  const { userData, logout } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  if (!userData) return <div className="p-6">Cargando...</div>;

  const sidebarUser: SidebarUser = {
    name: `${userData.firstName} ${userData.lastName}`,
    role: userData.role,
    avatar: userData.profile?.profilePicture ?? '',
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Navbar fija */}
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
          {/* Sidebar lateral */}
          <Sidebar user={sidebarUser} onLogout={logout} />
          {/* Formulario principal */}
          <div className="flex-1">
            <EditForm />
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
