import RegisterForm from './RegisterForm';
//import theme from '@/styles/styles';
import Image from 'next/image';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Registro | Pharmatech</title>
        <meta
          name="description"
          content="Regístrate en Pharmatech y accede a la mejor solución para tu salud."
        />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <div className="mb-6">
          <Image
            src="/images/logo-horizontal.svg"
            alt="Pharmatech"
            width={128}
            height={32}
            layout="intrinsic"
          />
        </div>
        <RegisterForm />
        <p className="mt-4 text-sm text-gray-600">
          ©2025 Pharmatech. Todos los derechos reservados
        </p>
        <div className="mt-2 text-sm text-gray-600">
          <a href="#" className="hover:underline">
            Política de privacidad
          </a>{' '}
          ·{' '}
          <a href="#" className="hover:underline">
            Términos y condiciones
          </a>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
