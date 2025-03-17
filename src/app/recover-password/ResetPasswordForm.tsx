'use client';
import { api } from '@/lib/sdkConfig';
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import Input from '@/components/Input/Input';
import { resetPasswordSchema } from '@/lib/validations/recoverPasswordSchema';
import theme from '@/styles/styles';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

type ResetPasswordFormProps = {
  onBack?: () => void;
  onSuccess?: () => void;
};

export default function ResetPasswordForm({
  onBack,
  onSuccess,
}: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setGeneralError('');
      setNewPasswordError('');
      setConfirmPasswordError('');

      const result = resetPasswordSchema.safeParse({
        newPassword,
        confirmPassword,
      });
      if (!result.success) {
        const { fieldErrors } = result.error.flatten();
        setNewPasswordError(fieldErrors.newPassword?.[0] || '');
        setConfirmPasswordError(fieldErrors.confirmPassword?.[0] || '');
        setLoading(false);
        return;
      }

      try {
        const jwt = sessionStorage.getItem('jwt');
        if (!jwt) {
          setGeneralError(
            'No se encontró el token. Por favor, reintenta el proceso',
          );
          setLoading(false);
          return;
        }

        const response = await api.auth.updatePassword(newPassword, jwt);

        console.log('Change Password response:', response);
        toast.success('Contraseña actualizada correctamente');
        setNewPassword('');
        setConfirmPassword('');
        if (onSuccess) onSuccess();
      } catch (err) {
        console.error('Error al cambiar la contraseña:', err);
        setGeneralError('Error al cambiar la contraseña. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    },
    [newPassword, confirmPassword, onSuccess],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-sm"
      noValidate
    >
      <div className="w-full max-w-sm">
        {onBack && (
          <p className="mb-4 cursor-pointer text-sm" onClick={onBack}>
            <ArrowUturnLeftIcon className="mr-1 h-5 w-5" />
          </p>
        )}
        <h3
          className="mx-auto mb-4 text-center"
          style={{
            fontSize: theme.FontSizes.h3.size,
            lineHeight: `${theme.FontSizes.h2.lineHeight}px`,
            color: theme.Colors.textMain,
          }}
        >
          Recuperar Contraseña
        </h3>
        <p
          className="mx-auto mb-6 text-center"
          style={{
            fontSize: theme.FontSizes.b1.size,
            color: theme.Colors.textMain,
          }}
        >
          Ingresa y confirma tu nueva contraseña
        </p>

        <div className="space-y-4">
          {/* Input para la nueva contraseña */}
          <div className="flex flex-col space-y-1">
            <Input
              label="Nueva contraseña"
              placeholder="Ingresa tu nueva contraseña"
              type="password"
              showPasswordToggle={true}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              borderColor="#393938"
              borderSize="1px"
            />
            {newPasswordError && (
              <p className="text-xs text-red-500" role="alert">
                {newPasswordError}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Input
              label="Confirmar contraseña"
              placeholder="Confirma tu nueva contraseña"
              type="password"
              showPasswordToggle={true}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              borderColor="#393938"
              borderSize="1px"
            />
            {confirmPasswordError && (
              <p className="text-xs text-red-500" role="alert">
                {confirmPasswordError}
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
            className="mt-4 flex w-full items-center justify-center gap-2 py-3"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Cambiando...' : 'Cambiar contraseña'}
          </Button>
        </div>
      </div>
    </form>
  );
}
