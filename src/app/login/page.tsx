import LoginForm from './LoginForm';
import theme from '@/styles/styles';
import Image from 'next/image';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Iniciar Sesión | Pharmatech</title>
        <meta
          name="description"
          content="Inicia sesión en Pharmatech y accede a la mejor solución para tu salud."
        />
      </Head>
      <div className="relative flex h-screen flex-col md:flex-row">
        <div className="absolute left-1/2 top-6 z-50 w-40 -translate-x-1/2 md:left-4 md:top-4 md:w-40 md:-translate-x-0">
          <Image
            src="/images/logo-horizontal.svg"
            alt="Pharmatech"
            width={128}
            height={32}
            layout="responsive"
            sizes="(max-width: 768px) 100vw, 128px"
          />
        </div>

        {/* Sección Izquierda - Formulario */}
        <div className="mt-32 flex w-full flex-col items-center justify-center p-0 md:mt-0 md:w-2/5 md:p-8">
          <div className="flex w-5/6 justify-center md:w-4/6">
            <LoginForm />
          </div>
          <div
            className="absolute bottom-4 left-6 hidden md:block"
            style={{
              fontSize: theme.FontSizes.b3.size,
              color: theme.Colors.textMain,
            }}
          >
            <p>©2025 Pharmatech. Todos los derechos reservados</p>
          </div>
        </div>

        {/* Sección Derecha - Imagen y Texto */}
        <div className="relative hidden md:block md:w-3/5">
          <div className="relative h-full w-full overflow-hidden rounded-l-2xl">
            <Image
              src="/images/login-image.jpg"
              alt="Farmacéutica trabajando"
              layout="fill"
              objectFit="cover"
              quality={100}
            />
          </div>

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
              Innovación en salud: la farmacia del futuro, disponible hoy
            </h2>
            <p
              style={{
                fontSize: theme.FontSizes.s1.size,
                color: theme.Colors.textWhite,
              }}
            >
              Descubre la forma más sencilla de comprar medicamentos en línea,
              con seguimiento en tiempo real y entrega segura
            </p>
          </div>
          <div
            className="absolute bottom-4 right-6"
            style={{
              fontSize: theme.FontSizes.b3.size,
              color: theme.Colors.textWhite,
            }}
          >
            <p>
              <a href="#" className="hover:underline">
                Política de privacidad
              </a>{' '}
              ·{' '}
              <a href="#" className="hover:underline">
                Términos y condiciones
              </a>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
