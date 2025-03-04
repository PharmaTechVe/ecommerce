import LoginForm from './LoginForm';
import theme from '@/styles/styles';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="relative flex h-screen flex-col md:flex-row">
      <div className="absolute left-1/2 top-6 -translate-x-1/2 md:left-4 md:top-4 md:-translate-x-0">
        <Image
          src="/images/logo-horizontal.svg"
          alt="Pharmatech"
          className="w-32"
        />
      </div>

      {/* Sección Izquierda - Formulario */}
      <div className="mt-32 flex w-full flex-col items-center justify-center p-0 md:mt-0 md:w-2/5 md:p-8">
        <div className="flex w-5/6 justify-center md:w-4/6">
          <LoginForm />
        </div>
      </div>

      {/* Sección Derecha - Imagen y Texto */}
      <div className="relative hidden md:block md:w-3/5">
        <Image
          src="/images/login-image.jpg"
          alt="Farmacéutica trabajando"
          className="h-full w-full rounded-l-2xl object-cover"
        />
        <div
          className="absolute bottom-16 left-16 right-8 rounded-2xl bg-black bg-opacity-50 p-6 text-white"
          style={{
            fontSize: theme.FontSizes.s1.size,
            backgroundColor: theme.Colors.primaryTransparent,
          }}
        >
          <h2
            style={{
              fontSize: theme.FontSizes.h3.size,
              color: theme.Colors.textWhite,
            }}
          >
            Somos Pharmatech, tu solución ideal en cada oportunidad
          </h2>
          <p
            style={{
              fontSize: theme.FontSizes.s1.size,
              color: theme.Colors.textWhite,
            }}
          >
            Explora la tienda online de medicamentos más grande de Venezuela
          </p>
        </div>
      </div>
    </div>
  );
}
