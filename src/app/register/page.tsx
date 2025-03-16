import RegisterForm from './RegisterForm';
//import theme from "@/styles/styles";
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="absolute left-6 top-6 w-40">
        <Image
          src="/images/logo-horizontal.svg"
          alt="Pharmatech Logo"
          width={160}
          height={40}
          layout="responsive"
        />
      </div>

      <div className="flex justify-center px-4 pt-32">
        <div className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-xl">
          <RegisterForm />
        </div>
      </div>

      <div className="absolute mt-4 flex w-full justify-between px-6 pb-8 pt-8 text-sm text-gray-600">
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
