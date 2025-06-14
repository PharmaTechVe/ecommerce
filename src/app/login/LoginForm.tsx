'use client';

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { loginSchema } from '@/lib/validations/loginSchema';
import Button from '@/components/Button';
import Input from '@/components/Input/Input';
import CheckButton from '@/components/CheckButton';
import theme from '@/styles/styles';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setGeneralError(null);

      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const { fieldErrors } = result.error.flatten();
        setEmailError(fieldErrors.email?.[0] ?? '');
        setPasswordError(fieldErrors.password?.[0] ?? '');
        setLoading(false);
        return;
      }

      setEmailError('');
      setPasswordError('');

      try {
        loginSchema.parse({ email, password });

        const response = await api.auth.login({ email, password });
        login(response.accessToken, remember);
        toast.success('Inicio de sesión exitoso');
        const redirect = searchParams?.get('redirect');
        if (redirect) {
          router.push(redirect);
        } else {
          router.push('/');
        }
        setEmail('');
        setPassword('');
      } catch (err) {
        console.error('Error en el login:', err);
        setGeneralError('Error al iniciar sesión. Verifica tus credenciales.');
      } finally {
        setLoading(false);
      }
    },
    [email, password, remember, router, login],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-sm"
      noValidate
    >
      <div className="w-full max-w-sm">
        <h3
          className="mx-auto mb-4 text-center"
          style={{
            fontSize: theme.FontSizes.h3.size,
            lineHeight: `${theme.FontSizes.h2.lineHeight}px`,
            color: theme.Colors.textMain,
          }}
        >
          Bienvenido
        </h3>
        <p
          className="mx-auto mb-6 text-center"
          style={{
            fontSize: theme.FontSizes.b1.size,
            color: theme.Colors.textMain,
          }}
        >
          Por favor introduce tus datos para iniciar sesión
        </p>

        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
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
              <p className="my-0 text-xs text-red-500" role="alert">
                {emailError}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Input
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              type="password"
              value={password}
              showPasswordToggle={true}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              borderColor="#393938"
              borderSize="1px"
            />
            {passwordError && (
              <p className="my-0 text-xs text-red-500" role="alert">
                {passwordError}
              </p>
            )}
          </div>

          <div className="flex w-full items-center justify-between whitespace-nowrap text-sm">
            <CheckButton
              text="Recordar"
              checked={remember}
              onChange={(newValue) => setRemember(newValue)}
            />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push('/recover-password');
              }}
              className="hover:underline"
              style={{
                fontSize: theme.FontSizes.b3.size,
                color: theme.Colors.secondaryLight,
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
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
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </Button>

          <p className="text-center text-sm">
            ¿No tienes cuenta?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push('/register');
              }}
              className="hover:underline"
              style={{
                fontSize: theme.FontSizes.b3.size,
                color: theme.Colors.secondaryLight,
              }}
            >
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}
