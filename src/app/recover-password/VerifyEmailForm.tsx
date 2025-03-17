'use client';
import { api } from '@/lib/sdkConfig';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import Input from '@/components/Input/Input';
import theme from '@/styles/styles';
import { emailSchema } from '@/lib/validations/recoverPasswordSchema';

type VerifyEmailFormProps = {
  onNext: () => void;
};

export default function VerifyEmailForm({ onNext }: VerifyEmailFormProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);

    const trimmedEmail = email.trim();

    const result = emailSchema.safeParse(trimmedEmail);

    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      setLoading(false);
      return;
    }
    setEmailError('');

    try {
      emailSchema.safeParse(email);
      const response = await api.auth.forgotPassword(trimmedEmail);

      console.log('Forgot Password response:', response);

      toast.success('Email verificado, se ha enviado el código.');
      onNext();
    } catch (err) {
      console.error('Error en el forgotPassword:', err);
      setGeneralError('Error al enviar el correo');
      toast.error(
        'Email no encontrado, verifica que el correo sea de una cuenta existente.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Título y tagline */}
      <div className="flex flex-col items-center">
        <h3
          className="mb-4 text-center"
          style={{
            fontSize: theme.FontSizes.h3.size,
            lineHeight: `${theme.FontSizes.h3.lineHeight}px`,
            color: theme.Colors.textMain,
          }}
        >
          Enviar correo electrónico
        </h3>
        <p
          className="mt-4 text-center"
          style={{
            fontSize: theme.FontSizes.b1.size,
            color: theme.Colors.textMain,
          }}
        >
          Ingresa el correo electrónico asociado a la cuenta para recuperar tu
          contraseña
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <Input
          label="Correo electrónico"
          placeholder="Ingresa tu correo electrónico"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
          borderColor="#393938"
          borderSize="1px"
        />
        {emailError && (
          <p className="text-xs text-red-500" role="alert">
            {emailError}
          </p>
        )}
      </div>

      {generalError && (
        <p className="text-xs text-red-500" role="alert">
          {generalError}
        </p>
      )}

      <Button
        variant="submit"
        className="flex w-full items-center justify-center gap-2 py-3"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? 'Cargando...' : 'Enviar código'}
      </Button>
    </form>
  );
}
