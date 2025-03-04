'use client';
import { PharmaTech } from '@pharmatech/sdk';
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import Input from '@/components/Input/FixedInput';
import CheckButton from '@/components/CheckButton';
import theme from '@/styles/styles';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email.trim() || !password.trim()) {
        setError('Por favor, completa todos los campos.');
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const api = new PharmaTech(true);
        const response = await api.auth.login({ email, password });
        console.log('Access token:', response.accessToken);
        sessionStorage.setItem('pharmatechToken', response.accessToken);
        if (remember) {
          localStorage.setItem('pharmatechToken', response.accessToken);
        }
        toast.success('Inicio de sesión exitoso');
      } catch (err) {
        console.error('Error en el login:', err);
        setError('Error al iniciar sesión. Verifica tus credenciales.');
      } finally {
        setLoading(false);
      }
    },
    [email, password, remember],
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
          <Input
            label="Correo electrónico"
            placeholder="Ingresa tu correo electrónico"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            borderColor="#393938"
            borderSize="1px"
          />

          <Input
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
            showPasswordToggle={true}
            onChange={(e) => setPassword(e.target.value)}
            borderColor="#393938"
            borderSize="1px"
          />

          <div className="flex w-full items-center justify-between whitespace-nowrap text-sm">
            <CheckButton
              text="Recordar"
              checked={remember}
              onChange={(newValue) => setRemember(newValue)}
            />
            <a
              href="#"
              className="hover:underline"
              style={{
                fontSize: theme.FontSizes.b3.size,
                color: theme.Colors.secondaryLight,
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          {error && (
            <p className="text-xs text-red-500" role="alert">
              {error}
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

          <Button
            variant="white"
            className="flex w-full items-center justify-center gap-2 py-3"
          >
            Iniciar sesión con Google
          </Button>

          <p className="text-center text-sm">
            ¿No tienes cuenta?{' '}
            <a
              href="#"
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
