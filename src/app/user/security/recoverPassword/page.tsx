'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import { FontSizes, Colors } from '@/styles/styles';
import { codeSchema } from '@/lib/validations/recoverPasswordSchema';
import { api } from '@/lib/sdkConfig';
import { z } from 'zod';
import UserProfileLayout from '@/components/User/ProfileLayout';

const emailSchema = z.string().email('Correo no válido');

export default function RecoverPasswordPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [codeError, setCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [hasSentOtp, setHasSentOtp] = useState(false);

  useEffect(() => {
    const sendOtp = async () => {
      if (!user?.email || hasSentOtp) return;

      const result = emailSchema.safeParse(user.email.trim());

      if (!result.success) {
        toast.error('Correo inválido. No se pudo enviar el código.');
        return;
      }

      try {
        await api.auth.forgotPassword(user.email);
        toast.success('Código enviado a tu correo.');
        setHasSentOtp(true);
      } catch (error) {
        console.error('Error enviando OTP:', error);
        toast.error('No se pudo enviar el código. Intenta más tarde.');
      }
    };

    sendOtp();
  }, [user, hasSentOtp]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setCodeError('');
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setGeneralError(null);
      setCodeError('');

      const codeString = code.join('');
      const result = codeSchema.safeParse(codeString);

      if (!result.success) {
        setCodeError(result.error.errors[0].message);
        setLoading(false);
        return;
      }

      try {
        if (!token) {
          toast.error('Token inválido');
          return;
        }

        await api.auth.validateOtp(codeString, token);
        localStorage.setItem('pharmatechToken', token);
        toast.success('Código verificado correctamente');
        setCode(Array(6).fill(''));
        router.push('/user/security/recoverPassword/resetPassword');
      } catch (err) {
        console.error('Error al verificar el código:', err);
        setGeneralError('Error al verificar el código. Intenta de nuevo.');
        toast.error('Error al verificar el código. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    },
    [code, token, router],
  );

  if (!user) return <div className="p-6">Cargando...</div>;

  return (
    <UserProfileLayout>
      {() => (
        <div className="relative min-h-screen bg-white">
          <div className="flex flex-1 flex-col items-center justify-start px-4 md:px-0">
            <div className="w-full max-w-[620px] space-y-6 p-4 text-center md:p-6">
              <h3
                className="font-semibold"
                style={{ fontSize: FontSizes.h3.size, color: Colors.textMain }}
              >
                Recuperación de Contraseña
              </h3>
              <p
                className="text-base"
                style={{ fontSize: FontSizes.b1.size, color: Colors.textMain }}
              >
                Hemos enviado un código de verificación a tu correo para
                restablecer tu contraseña. Ingrésalo aquí
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-center space-x-2">
                    {code.map((char, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        placeholder="-"
                        maxLength={1}
                        value={char}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={(el) => {
                          inputsRef.current[index] = el;
                        }}
                        className="h-10 w-10 rounded border border-gray-400 text-center"
                      />
                    ))}
                  </div>
                  {codeError && (
                    <p className="text-xs text-red-500" role="alert">
                      {codeError}
                    </p>
                  )}
                  {generalError && (
                    <p className="text-xs text-red-500" role="alert">
                      {generalError}
                    </p>
                  )}
                  <Button
                    variant="submit"
                    className="mt-8 h-[50px] w-[350px] font-semibold text-white"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? 'Cargando...' : 'Verificar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <ToastContainer />
        </div>
      )}
    </UserProfileLayout>
  );
}
