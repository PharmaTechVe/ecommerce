'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';
import { Colors } from '@/styles/styles';
import { updatePasswordSchema } from '@/lib/validations/updatePasswordSchema';
import Link from 'next/link';

interface UserPasswordFormProps {
  onSubmit: (
    password: string,
    newPassword: string,
    confirmPassword: string,
  ) => void;
}

export default function UserPasswordForm({ onSubmit }: UserPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = updatePasswordSchema.safeParse({
      password,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setErrors({
        password: fieldErrors.password?.[0] ?? '',
        newPassword: fieldErrors.newPassword?.[0] ?? '',
        confirmPassword: fieldErrors.confirmPassword?.[0] ?? '',
      });
      return;
    }

    try {
      setLoading(true);
      onSubmit(password, newPassword, confirmPassword);
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      toast.error('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <Input
        label="Contraseña Actual"
        placeholder="Ingresa tu contraseña actual"
        type="password"
        showPasswordToggle
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        borderColor="#393938"
        borderSize="1px"
      />
      {errors.password && (
        <p className="text-xs text-red-500">{errors.password}</p>
      )}

      <Input
        label="Nueva Contraseña"
        placeholder="Ingresa tu nueva contraseña"
        type="password"
        showPasswordToggle
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        borderColor="#393938"
        borderSize="1px"
      />
      {errors.newPassword && (
        <p className="text-xs text-red-500">{errors.newPassword}</p>
      )}

      <Input
        label="Confirmar Contraseña"
        placeholder="Confirma tu nueva contraseña"
        type="password"
        showPasswordToggle
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        borderColor="#393938"
        borderSize="1px"
      />
      {errors.confirmPassword && (
        <p className="text-xs text-red-500">{errors.confirmPassword}</p>
      )}

      <p className="text-sm">
        ¿Olvidaste tu contraseña?{' '}
        <Link
          href={`/user/security/recover-password`}
          style={{ color: Colors.secondaryLight }}
        >
          Haz click aquí
        </Link>
      </p>

      <Button
        variant="submit"
        className="mt-2 h-[46px] w-full font-semibold text-white"
        disabled={loading}
      >
        {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
      </Button>
    </form>
  );
}
