'use client';

import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import { codeSchema } from '@/lib/validations/recoverPasswordSchema';

type EnterCodeFormProps = {
  onBack?: () => void;
  onNext?: (code: string) => void;
};

export default function EnterCodeForm({ onNext }: EnterCodeFormProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [codeError, setCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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
        if (onNext) onNext(codeString);
        setCode(Array(6).fill(''));
      } catch (err) {
        console.error('Error interno al enviar el código:', err);
        setGeneralError('Ocurrió un error inesperado');
        toast.error('Ocurrió un error inesperado');
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
