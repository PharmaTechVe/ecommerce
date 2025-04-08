'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { useAuth } from '@/context/AuthContext';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import NavBar from '@/components/Navbar';
import Button from '@/components/Button';
import { FontSizes, Colors } from '@/styles/styles';
import { api } from '@/lib/sdkConfig';

type UserAddressAPIResponse = {
  id: string;
  adress: string;
  zipCode: string;
  nameState: string;
};

export default function AddressPage() {
  const { userData, logout, token } = useAuth();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [addresses, setAddresses] = useState<UserAddressAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (!token || !userData?.id) {
          console.error('Token o ID de usuario inválido');
          return;
        }

        const response = await api.userAdress.getListAddresses(
          userData.id,
          token,
        );
        setAddresses(response);
      } catch (error) {
        console.error('Error al cargar direcciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userData?.id, token]);

  if (!userData) return <div className="p-6">Cargando...</div>;

  const sidebarUser: SidebarUser = {
    name: `${userData.firstName} ${userData.lastName}`,
    role: userData.role,
    avatar: userData.profile?.profilePicture ?? '',
  };

  return (
    <div className="relative min-h-screen bg-white">
      <NavBar onCartClick={() => {}} /> {/* ✅ NavBar agregado */}
      {!showSidebar && (
        <button
          className="absolute left-4 top-4 z-50 md:hidden"
          onClick={() => setShowSidebar(true)}
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
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

        {/* Contenido */}
        <div className="flex flex-1 flex-col items-center px-4 md:px-0">
          <div className="w-full max-w-3xl space-y-6 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <h2
                className={`font-regular text-[${FontSizes.b1.size}] text-[${Colors.textMain}]`}
              >
                Mis Direcciones
              </h2>
              <Button
                className={`font-regular h-[48px] max-w-[226px] whitespace-nowrap bg-primary px-4 py-2 text-white text-[${FontSizes.b1.size}]`}
                onClick={() => router.push('/user/address/new')}
              >
                Agregar nueva dirección
              </Button>
            </div>

            {loading ? (
              <p className="text-center text-sm text-gray-500">
                Cargando direcciones...
              </p>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="flex items-center justify-between rounded border border-gray-50 bg-gray-50 px-4 py-3"
                  >
                    <p
                      className={`flex-1 pr-4 text-[${FontSizes.b1.size}] text-[${Colors.textMain}]`}
                    >
                      {addr.adress}, {addr.zipCode}, {addr.nameState}
                    </p>
                    <div className="flex gap-3">
                      <button
                        className="text-gray-600 hover:text-primary"
                        onClick={() =>
                          router.push(`/user/address/${addr.id}/edit`)
                        }
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-red-500"
                        onClick={() => alert(`Eliminar dirección: ${addr.id}`)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
