'use client';

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import UserProfileLayout from '@/components/User/ProfileLayout';
import UserPasswordForm from '@/components/User/UserPasswordForm';
import { Colors, FontSizes } from '@/styles/styles';
import { api } from '@/lib/sdkConfig';

export default function UpdatePasswordPage() {
  const router = useRouter();

  return (
    <UserProfileLayout>
      {() => (
        <div className="flex w-full justify-center px-4 md:px-0">
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

            <UserPasswordForm
              onSubmit={async (password: string, newPassword: string) => {
                try {
                  const token = sessionStorage.getItem('jwt');
                  if (!token) {
                    throw new Error('Token no encontrado');
                  }

                  await api.auth.updateCurrentPassword(
                    password,
                    newPassword,
                    token,
                  );
                  toast.success('Contraseña actualizada con éxito');
                  router.push('/user');
                } catch (error) {
                  console.error('Error al actualizar la contraseña:', error);
                  toast.error(
                    'Hubo un problema al actualizar tu contraseña. Intenta nuevamente.',
                  );
                }
              }}
            />
          </div>
        </div>
      )}
    </UserProfileLayout>
  );
}
