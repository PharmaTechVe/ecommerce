'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import { z } from 'zod';
import { resetPasswordSchema } from '@/lib/validations/recoverPasswordSchema';
import { FontSizes, Colors } from '@/styles/styles';

import UserProfileLayout from '@/components/User/ProfileLayout';
import EnterCodeForm from '@/components/User/EnterCodeForm';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';

const emailSchema = z.string().email('Correo no válido');

export default function RecoverPasswordPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<'enterCode' | 'resetPassword'>('enterCode');
  const [hasSentOtp, setHasSentOtp] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sendOtp = async () => {
      if (!user?.email || hasSentOtp) return;

      const result = emailSchema.safeParse(user.email.trim());
      if (!result.success) {
        toast.error('Correo inválido. No se pudo enviar el código.');
        return;
      }

      try {
        await api.auth.resetPassword(user.email);
        toast.success('Código enviado a tu correo.');
        setHasSentOtp(true);
      } catch (error) {
        console.error('Error enviando OTP:', error);
        toast.error('No se pudo enviar el código. Intenta más tarde.');
      }
    };

    sendOtp();
  }, [user, hasSentOtp]);

  const handleCodeVerified = async (code: string) => {
    try {
      if (!token) {
        toast.error('Token inválido');
        return;
      }

      await api.auth.validateOtp(code, token);
      sessionStorage.setItem('pharmatechToken', token);
      toast.success('Código verificado correctamente');
      setStep('resetPassword');
    } catch (err) {
      console.error('Error al verificar el código:', err);
      toast.error('Código incorrecto. Intenta de nuevo.');
    }
  };

  const handleSubmitNewPassword = async () => {
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

    const finalToken =
      sessionStorage.getItem('pharmatechToken') ||
      localStorage.getItem('pharmatechToken');

    if (!finalToken) {
      toast.error('Token inválido. Vuelve a iniciar el proceso.');
      return;
    }

    try {
      setLoading(true);
      await api.auth.updatePassword(newPassword, finalToken);
      toast.success('Contraseña actualizada correctamente');
      setTimeout(() => {
        logout();
        router.push('/login');
      }, 800);
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      toast.error('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6">Cargando...</div>;

  return (
    <UserProfileLayout>
      {() => (
        <div className="relative min-h-screen bg-white">
          <div className="flex flex-1 justify-center px-4 md:px-0">
            <div className="w-full max-w-[620px] space-y-6 p-4 text-center md:p-6">
              {step === 'enterCode' && (
                <>
                  <h3
                    className="font-semibold"
                    style={{
                      fontSize: FontSizes.h3.size,
                      color: Colors.textMain,
                    }}
                  >
                    Recuperación de Contraseña
                  </h3>
                  <p
                    className="text-base"
                    style={{
                      fontSize: FontSizes.b1.size,
                      color: Colors.textMain,
                    }}
                  >
                    Hemos enviado un código a tu correo. Ingrésalo para
                    continuar.
                  </p>

                  <EnterCodeForm onNext={handleCodeVerified} />
                </>
              )}

              {step === 'resetPassword' && (
                <>
                  <h3
                    className="font-semibold"
                    style={{
                      fontSize: FontSizes.h3.size,
                      color: Colors.textMain,
                    }}
                  >
                    Crear Nueva Contraseña
                  </h3>
                  <p
                    className="text-base"
                    style={{
                      fontSize: FontSizes.b1.size,
                      color: Colors.textMain,
                    }}
                  >
                    Ingresa y confirma tu nueva contraseña para finalizar el
                    proceso.
                  </p>

                  <div className="mt-6 space-y-6 text-left">
                    <Input
                      label="Nueva contraseña"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      borderColor="#393938"
                      showPasswordToggle
                      helperText={errors.newPassword}
                      helperTextColor="red-500"
                    />
                    <Input
                      label="Confirmar contraseña"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      borderColor="#393938"
                      showPasswordToggle
                      helperText={errors.confirmPassword}
                      helperTextColor="red-500"
                    />

                    <Button
                      variant="submit"
                      className="w-full font-semibold text-white"
                      onClick={handleSubmitNewPassword}
                      disabled={loading}
                    >
                      {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </UserProfileLayout>
  );
}
