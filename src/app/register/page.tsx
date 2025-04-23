import RegisterForm from './RegisterForm';
//import theme from "@/styles/styles";
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="absolute left-1/2 top-6 z-50 w-40 -translate-x-1/2 md:left-4 md:top-4 md:w-40 md:-translate-x-0">
        <Link href="/">
          <Image
            src="/images/logo-horizontal.svg"
            alt="Pharmatech Logo"
            width={160}
            height={40}
            layout="responsive"
          />
        </Link>
      </div>

      <div className="flex justify-center px-4 pt-32">
        <div className="w-full max-w-3xl rounded-none bg-white p-4 shadow-none md:rounded-lg md:p-8 md:shadow-xl">
          <RegisterForm />
        </div>
      </div>

      <div className="absolute mt-4 hidden w-full justify-between px-6 pb-8 pt-8 text-sm text-gray-600 md:flex">
        <p>©2025 Pharmatech. Todos los derechos reservados</p>
        <p>
          <Link href="#" className="hover:underline">
            Política de privacidad
          </Link>{' '}
          ·{' '}
          <Link href="#" className="hover:underline">
            Términos y condiciones
          </Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}
