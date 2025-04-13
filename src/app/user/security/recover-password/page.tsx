'use client';

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import { resetPasswordSchema } from '@/lib/validations/recoverPasswordSchema';
import { FontSizes, Colors } from '@/styles/styles';

import UserProfileLayout from '@/components/User/ProfileLayout';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';
import EnterCodeForm from '@/components/User/EnterCodeForm';

export default function RecoverPasswordPage() {
  const { user, token } = useAuth();

  const [step, setStep] = useState<'enterCode' | 'resetPassword'>('enterCode');
  const [resendTimer, setResendTimer] = useState(30);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'enterCode' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer, step]);

  useEffect(() => {
    if (!user?.email) return;

    api.auth
      .forgotPassword(user.email)
      .then(() => {
        toast.success('Código enviado a tu correo.');
        setResendTimer(30);
      })
      .catch((error) => {
        console.error('Error enviando OTP:', error);
        toast.error('No se pudo enviar el código. Intenta más tarde.');
      });
  }, [user?.email]);

  const handleCodeSubmit = async (code: string) => {
    try {
      await api.auth.resetPassword(code);
      toast.success('Código verificado correctamente');
      setStep('resetPassword');
    } catch (error) {
      console.error('Error al verificar el código:', error);
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
      localStorage.getItem('pharmatechToken') ||
      token;

    if (!finalToken) {
      toast.error('Token inválido. Vuelve a iniciar el proceso.');
      return;
    }

    try {
      setLoading(true);
      await api.auth.updatePassword(newPassword, finalToken);
      toast.success('Contraseña actualizada correctamente');
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
              <h3
                className="font-semibold"
                style={{ fontSize: FontSizes.h3.size, color: Colors.textMain }}
              >
                Recuperación de Contraseña
              </h3>

              {/* Paso 1: Ingreso de código */}
              {step === 'enterCode' && (
                <>
                  <p
                    className="text-base"
                    style={{
                      fontSize: FontSizes.b1.size,
                      color: Colors.textMain,
                    }}
                  >
                    Hemos enviado un código de verificación a tu correo para
                    restablecer tu contraseña. Ingrésalo aquí
                  </p>

                  <EnterCodeForm onNext={handleCodeSubmit} />

                  {/* Reenviar código */}
                  <p
                    className="mt-4"
                    style={{
                      color: resendTimer > 0 ? '#999' : Colors.secondaryLight,
                      cursor: resendTimer > 0 ? 'default' : 'pointer',
                      fontSize: FontSizes.b1.size,
                    }}
                    onClick={() => {
                      if (!user?.email || resendTimer > 0) return;

                      api.auth
                        .forgotPassword(user.email)
                        .then(() => {
                          toast.success('Código reenviado a tu correo.');
                          setResendTimer(30);
                        })
                        .catch((error) => {
                          console.error('Error reenviando código:', error);
                          toast.error(
                            'No se pudo reenviar el código. Intenta más tarde.',
                          );
                        });
                    }}
                  >
                    {resendTimer > 0
                      ? `¿No recibiste el código? Reenviar en ${resendTimer}s`
                      : '¿No recibiste el código? Reenviar'}
                  </p>
                </>
              )}

              {/* Paso 2: Nueva contraseña */}
              {step === 'resetPassword' && (
                <>
                  <p
                    className="text-base"
                    style={{
                      fontSize: FontSizes.b1.size,
                      color: Colors.textMain,
                    }}
                  >
                    Actualiza tu contraseña para proteger la seguridad de tu
                    cuenta
                  </p>
                  <div className="mt-6 space-y-6 text-left">
                    <Input
                      label="Nueva contraseña"
                      type="password"
                      placeholder="Ingresa tu nueva contraseña"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      borderColor="#393938"
                      showPasswordToggle
                      helperText={errors.newPassword}
                      helperTextColor="red-500"
                    />
                    <Input
                      label="Confirmar nueva contraseña"
                      type="password"
                      placeholder="Confirma tu nueva contraseña"
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
