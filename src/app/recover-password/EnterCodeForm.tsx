'use client';
import { api } from '@/lib/sdkConfig';
import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import theme from '@/styles/styles';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { codeSchema } from '@/lib/validations/recoverPasswordSchema'; // Importa el esquema externo

type EnterCodeFormProps = {
  onBack: () => void;
  onNext?: () => void;
};

export default function EnterCodeForm({ onBack, onNext }: EnterCodeFormProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [codeError, setCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    // Aceptar solo el último carácter si se pega o se escribe más de uno
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setCodeError('');

    // Si se ingresó un carácter y no es el último, enfocamos el siguiente input
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

        console.log('Reset Password response:', response);

        toast.success('Código verificado correctamente');
        if (onNext) onNext();
        setCode(Array(6).fill(''));
      } catch (err) {
        console.error('Error al verificar el código:', err);
        setGeneralError('Error al verificar el código. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    },
    [code, onNext],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-sm"
      noValidate
    >
      <div className="w-full max-w-sm">
        <p className="mb-4 cursor-pointer text-sm" onClick={onBack}>
          <ArrowUturnLeftIcon className="mr-1 h-5 w-5" />
        </p>
        <h3
          className="mx-auto mb-4 text-center"
          style={{
            fontSize: theme.FontSizes.h3.size,
            lineHeight: `${theme.FontSizes.h2.lineHeight}px`,
            color: theme.Colors.textMain,
          }}
        >
          Ingresar código de recuperación
        </h3>
        <p
          className="mx-auto mb-6 text-center"
          style={{
            fontSize: theme.FontSizes.b1.size,
            color: theme.Colors.textMain,
          }}
        >
          Ingresa el código enviado a tu correo
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
          <p className="mt-1 text-xs text-red-500" role="alert">
            {codeError}
          </p>
        )}
        {generalError && (
          <p className="mt-1 text-xs text-red-500" role="alert">
            {generalError}
          </p>
        )}

        <div className="mt-8 flex items-center justify-center">
          <Button
            variant="submit"
            className="flex w-full items-center justify-center gap-2 py-3"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Cargando...' : 'Verificar código'}
          </Button>
        </div>
      </div>
    </form>
  );
}
