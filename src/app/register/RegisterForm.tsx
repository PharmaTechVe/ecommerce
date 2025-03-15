'use client';
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { registerSchema } from '@/lib/validations/registerSchema';
import Button from '@/components/Button';
import Input from '@/components/Input/Input';
import CheckButton from '@/components/CheckButton';
import theme from '@/styles/styles';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      const result = registerSchema.safeParse({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        documentId,
        phone,
      });
      if (!result.success) {
        toast.error('Por favor, revisa los campos ingresados.');
        setLoading(false);
        return;
      }

      setLoading(false);
    },
    [firstName, lastName, email, password, confirmPassword, documentId, phone],
  );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 rounded-lg bg-white p-8 shadow-lg"
        noValidate
      >
        <h3 className="text-center text-2xl font-semibold text-gray-800">
          Registro
        </h3>
        <p className="text-center text-sm text-gray-600">
          Por favor introduce tus datos para crear una cuenta
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            borderSize="1px"
          />
          <Input
            label="Apellido"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            borderSize="1px"
          />
        </div>
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="correo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          borderSize="1px"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Documento de identidad"
            placeholder="123456789"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            borderSize="1px"
          />
          <Input
            label="Teléfono"
            type="text"
            placeholder="04241234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            borderSize="1px"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Contraseña"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle
            borderSize="1px"
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="******"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPasswordToggle
            borderSize="1px"
          />
        </div>
        <CheckButton
          text="Acepto los términos y condiciones"
          checked={acceptTerms}
          onChange={(newValue) => setAcceptTerms(newValue)}
        />
        <Button variant="submit" className="w-full" disabled={loading}>
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </Button>
        <p className="text-center text-sm">
          ¿Ya tienes una cuenta?{' '}
          <a
            href="/login"
            className="hover:underline"
            style={{ color: theme.Colors.secondaryLight }}
          >
            Iniciar sesión
          </a>
        </p>
      </form>
    </div>
  );
}
