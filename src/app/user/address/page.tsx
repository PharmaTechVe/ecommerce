'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '@/context/AuthContext';
import { Sidebar, type SidebarUser } from '@/components/SideBar';
import NavBar from '@/components/Navbar';
import Button from '@/components/Button';
import { FontSizes, Colors } from '@/styles/styles';
import { api } from '@/lib/sdkConfig';
import UserBreadcrumbs from '@/components/User/UserBreadCrumbs';
import ModalConfirm from '@/components/ModalConfirm';
import { toast } from 'react-toastify';

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  documentId: string;
  phoneNumber: string;
  role?: string;
  profile: {
    profilePicture?: string;
  };
};

type UserAddressAPIResponse = {
  id: string;
  adress: string;
  zipCode: string;
  nameState: string;
};

export default function AddressPage() {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const [addresses, setAddresses] = useState<UserAddressAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<UserProfile | null>(null);

  // Modal confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user?.sub) {
      setUserData(null);
      router.push('/login');
      return;
    }
    (async () => {
      try {
        const profileResponse = await api.user.getProfile(user.sub, token);
        const userData: UserProfile = {
          firstName: profileResponse.firstName,
          lastName: profileResponse.lastName,
          email: profileResponse.email || '',
          documentId: profileResponse.documentId || '',
          phoneNumber: profileResponse.phoneNumber || '',
          role: profileResponse.role,
          profile: {
            profilePicture: profileResponse.profile?.profilePicture || '',
          },
        };
        setUserData(userData);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
        setUserData(null);
      }
    })();
  }, [user?.sub, token, router]);

  const isNewAddress = searchParams.get('new') === 'true';

  const fetchAddresses = async () => {
    try {
      if (!token || !user?.sub) return;
      const response = await api.userAdress.getListAddresses(user.sub, token);
      setAddresses(response);
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNewAddress) fetchAddresses();
  }, [user?.sub, token, isNewAddress]);

  const handleConfirmDelete = async () => {
    if (!token || !user?.sub || !addressToDelete) return;

    try {
      await api.userAdress.deleteAddress(user.sub, addressToDelete, token);
      toast.success('Dirección eliminada');
      setShowConfirmModal(false);
      setAddressToDelete(null);

      setTimeout(() => {
        fetchAddresses();
      }, 500);
    } catch (err) {
      console.error('Error al eliminar dirección:', err);
      toast.error('No se pudo eliminar la dirección.');
    }
  };

  if (!user || loading) return <div className="p-6">Cargando...</div>;

  const sidebarUser: SidebarUser = userData
    ? {
        name: `${userData.firstName} ${userData.lastName}`,
        role: userData.role || '',
        avatar: userData.profile?.profilePicture ?? '',
      }
    : {
        name: 'Usuario',
        role: '',
        avatar: '',
      };

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

      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col gap-6 pt-4 md:flex-row">
          <Sidebar
            user={sidebarUser}
            onLogout={logout}
            className="ml-[104px]"
          />
          <div className="flex flex-1 flex-col items-center px-4 md:px-0">
            <div className="w-full max-w-3xl space-y-6 py-4 md:py-6">
              <div className="w-full md:flex md:items-center md:justify-between">
                <div className="relative h-[48px] w-full md:w-[496px]">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar dirección"
                    className="h-[48px] w-full rounded-md border border-gray-300 py-2 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <MagnifyingGlassIcon className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                </div>
                <div className="hidden md:block">
                  <Button
                    className={`font-regular ml-[24px] h-[48px] w-[220px] bg-primary px-4 py-2 text-white text-[${FontSizes.b1.size}]`}
                    onClick={() => router.push('/user/address/new')}
                  >
                    Agregar nueva dirección
                  </Button>
                </div>
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
                          ? 'border-gray-100 bg-gray-50'
                          : 'border-gray-100 bg-white'
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
                            router.push(`/user/address/${addr.id}/edit`)
                          }
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-red-500"
                          onClick={() => {
                            setAddressToDelete(addr.id);
                            setShowConfirmModal(true);
                          }}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 block md:hidden">
                <Button
                  className={`font-regular h-[48px] w-full bg-primary px-4 py-2 text-white text-[${FontSizes.b1.size}]`}
                  onClick={() => router.push('/user/address/new')}
                >
                  Agregar nueva dirección
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Suspense>

      {/* Modal confirmación */}
      {showConfirmModal && (
        <ModalConfirm
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmDelete}
          title="¿Estás seguro de eliminar esta dirección?"
          description="Esta acción no se puede deshacer."
          cancelText="Cancelar"
          confirmText="Eliminar"
        />
      )}
    </div>
  );
}
