'use client';
import Button from '@/components/Button';
import Input from '@/components/Input/Input';
import theme from '@/styles/styles';
import Image from 'next/image';

export default function LoginForm() {
  //const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");

  return (
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
          //onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          //onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-between text-sm">
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

        <Button
          variant="submit"
          className="flex w-full items-center justify-center gap-2 py-3"
        >
          Iniciar sesión
        </Button>

        <Button
          variant="white"
          className="flex w-full items-center justify-center gap-2 py-3"
        >
          <Image
            src="images/google-icon.svg"
            alt="Google"
            className="h-5 w-5"
          />
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
  );
}
