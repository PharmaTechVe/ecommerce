'use client';
import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

import Button from '@/components/Button';
import theme from '@/styles/styles';
import { api } from '@/lib/sdkConfig';
import { codeSchema } from '@/lib/validations/recoverPasswordSchema';

type EnterCodeFormProps = {
  onBack: () => void;
  onNext?: () => void;
  show: boolean;
  onClose: () => void;
};

export default function EnterCodeFormModal({
  onNext,
  show,
  onClose,
}: EnterCodeFormProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [codeError, setCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
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
        const response = await api.auth.resetPassword(codeString);
        sessionStorage.setItem('jwt', response.accessToken);
        toast.success('Código verificado correctamente');
        if (onNext) onNext();
        setCode(Array(6).fill(''));
        onClose(); //agregar funcionalidad
      } catch (err) {
        console.error('Error al verificar el código:', err);
        setGeneralError('Error al verificar el código. Intenta de nuevo.');
        toast.error('Error al verificar el código. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    },
    [code, onNext, onClose],
  );

  if (show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative bg-white p-6 shadow-lg"
        style={{
          width: '442px',
          height: '489px',
          borderRadius: '16px',
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-8 top-5 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mt-20">
            <h3
              className="mx-auto mb-4 text-center"
              style={{
                fontSize: theme.FontSizes.h3.size,
                lineHeight: `${theme.FontSizes.h2.lineHeight}px`,
                color: theme.Colors.textMain,
              }}
            >
              Confirma tu correo electrónico
            </h3>
            <p
              className="mx-auto mb-6 text-center"
              style={{
                fontSize: theme.FontSizes.b1.size,
                color: theme.Colors.textMain,
              }}
            >
              Introduce el código enviado a tu correo para confirmarlo
            </p>

            <div className="flex justify-center space-x-2">
              {code.map((char, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  placeholder="-"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  className="h-10 w-10 rounded border border-gray-400 text-center"
                />
              ))}
            </div>
            {codeError && (
              <p className="ml-5 mt-5 text-xs text-red-500" role="alert">
                {codeError}
              </p>
            )}
            {generalError && (
              <p className="ml-5 mt-5 text-xs text-red-500" role="alert">
                {generalError}
              </p>
            )}

            <div className="mt-6 flex items-center justify-center">
              <Button
                variant="submit"
                className="flex w-full items-center justify-center gap-2 py-3"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Cargando...' : 'Verificar código'}
              </Button>
            </div>
            <div className="mt-2 flex w-full justify-end">
              <button
                type="button"
                className="text-sm font-light text-[#4CD3B5] hover:underline"
                onClick={() => toast.info('Código reenviado')}
              >
                Reenviar código
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
