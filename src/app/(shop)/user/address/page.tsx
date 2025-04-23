'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import { FontSizes, Colors } from '@/styles/styles';
import { api } from '@/lib/sdkConfig';
import ModalConfirm from '@/components/ModalConfirm';
import { toast } from 'react-toastify';
import Loading from '@/app/loading';

type UserAddressAPIResponse = {
  id: string;
  adress: string;
  zipCode: string;
  nameState: string;
};

export default function AddressPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<UserAddressAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const rawSearchParams = useSearchParams();
  const isNewAddress = rawSearchParams?.get('new') === 'true';

  const fetchAddresses = useCallback(async () => {
    try {
      if (!token || !user?.sub) return;
      const response = await api.userAdress.getListAddresses(user.sub, token);
      setAddresses(response);
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    } finally {
      setLoading(false);
    }
  }, [token, user?.sub]);

  useEffect(() => {
    if (!isNewAddress) fetchAddresses();
  }, [user?.sub, token, isNewAddress, fetchAddresses]);

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

  if (!user || loading) return <Loading />;

  return (
    <>
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
                  className={`flex w-full items-start justify-between rounded border px-4 py-3 md:w-[818px] ${
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
    </>
  );
}
