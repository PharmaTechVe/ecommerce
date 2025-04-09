'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '@/context/AuthContext';
import { Sidebar, SidebarUser } from '@/components/SideBar';
import NavBar from '@/components/Navbar';
import Button from '@/components/Button';
import { FontSizes, Colors } from '@/styles/styles';
import { PharmaTech } from '@pharmatech/sdk';
import EditForm from '@/components/User/editUserAddressForm';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';

type UserAddressAPIResponse = {
  id: string;
  adress: string;
  zipCode: string;
  nameState: string;
};

function NewAddressView({
  logout,
  showSidebar,
  setShowSidebar,
  sidebarUser,
}: {
  logout: () => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  sidebarUser: SidebarUser;
}) {
  return (
    <div className="relative min-h-screen bg-white">
      <NavBar onCartClick={() => {}} />

      <div className="px-6 pt-6 md:pl-[104px]">
        <UserBreadcrumbs />
      </div>

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

      <div className="flex flex-col gap-6 pt-4 md:flex-row">
        <Sidebar user={sidebarUser} onLogout={logout} />

        <div className="flex flex-1 flex-col items-center px-4 md:px-0">
          <div className="w-full max-w-3xl space-y-6 py-4 md:py-6">
            <h2
              className={`font-regular text-[${FontSizes.b1.size}] text-[${Colors.textMain}]`}
            >
              Crear nueva dirección
            </h2>
            <EditForm mode="create" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddressPage() {
  const { userData, logout, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const [addresses, setAddresses] = useState<UserAddressAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const pharmaTech = PharmaTech.getInstance(true);

  const isNewAddress = searchParams.get('new') === 'true';

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (!token || !userData?.id) return;

        const response = await pharmaTech.userAdress.getListAddresses(
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

    if (!isNewAddress) fetchAddresses();
  }, [userData?.id, token, isNewAddress]);

  {
    /* const handleSearch = async (searchTerm: string) => {
    try {
      if (!token || !userData?.id) return;

      // Se comenta la lógica para la petición de búsqueda
      // const response = await pharmaTech.userAdress.getAddress(
      //   userData.id,
      //   token,
      //   searchTerm
      // );
      // setAddresses(response); 

      // Aquí iría la lógica para filtrar las direcciones, por ahora solo se usa el estado `searchTerm`.
    } catch (error) {
      console.error('Error al buscar direcciones:', error);
    }
  };*/
  }

  if (!userData) return <div className="p-6">Cargando...</div>;

  const sidebarUser: SidebarUser = {
    name: `${userData.firstName} ${userData.lastName}`,
    role: userData.role,
    avatar: userData.profile?.profilePicture ?? '',
  };

  if (isNewAddress) {
    return (
      <NewAddressView
        logout={logout}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        sidebarUser={sidebarUser}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <NavBar onCartClick={() => {}} />

      <div className="px-6 pt-6 md:pl-[104px]">
        <UserBreadcrumbs />
      </div>

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

      <div className="flex flex-col gap-6 pt-4 md:flex-row">
        <Sidebar user={sidebarUser} onLogout={logout} className="ml-[104px]" />

        <div className="flex flex-1 flex-col items-center px-4 md:px-0">
          <div className="w-full max-w-3xl space-y-6 py-4 md:py-6">
            <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
              {/* Input de búsqueda */}
              <div className="relative mb-4 h-[48px] w-full md:w-[496px]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    //handleSearch(e.target.value); // Ejecutar la búsqueda por ahora en revision
                  }}
                  placeholder="Buscar dirección"
                  className="h-[48px] w-[496px] rounded-md border border-gray-300 py-2 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <MagnifyingGlassIcon className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>

              {/* Botón de "Agregar nueva dirección" */}
              <Button
                className="font-regular text-[${FontSizes.b1.size}] ml-[24px] h-[48px] w-[180px] bg-primary px-4 py-2 text-white md:w-auto"
                onClick={() => router.push('/user/address?new=true')}
              >
                Agregar nueva dirección
              </Button>
            </div>

            {loading ? (
              <p className="text-center text-sm text-gray-500">
                Cargando direcciones...
              </p>
            ) : (
              <div className="w-full space-y-4">
                {addresses.map((addr, index) => (
                  <div
                    key={addr.id}
                    className={`flex h-[43px] w-full items-center justify-between rounded border px-4 md:w-[818px] ${
                      index % 2 === 0
                        ? 'border-gray-50 bg-gray-50'
                        : 'border-white bg-white'
                    }`}
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
                          router.push(`/user/address/${addr.id}/edit-address`)
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
