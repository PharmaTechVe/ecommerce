'use client';
import React, { useState } from 'react';
import VerifyEmailForm from './VerifyEmailForm';
import EnterCodeForm from './EnterCodeForm';
import ResetPasswordForm from './ResetPasswordForm';
import theme from '@/styles/styles';
import Image from 'next/image';
import Head from 'next/head';
import Stepper from '@/components/Stepper';
import { ToastContainer } from 'react-toastify';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function RecoverPasswordPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleReturnToLogin = () => {
    router.push('/login');
  };

  const steps = ['Verificar correo', 'Ingresar código', 'Resetear contraseña'];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <VerifyEmailForm onNext={handleNext} />;
      case 1:
        return <EnterCodeForm onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <ResetPasswordForm onBack={() => setCurrentStep(1)} />;
      default:
        return null;
    }
  };
  return (
    <>
      <Head>
        <title>Recuperar contraseña | Pharmatech</title>
        <meta
          name="description"
          content="Recupera tu contraseña y sigue disfrutando de la mejor farmacia de Venezuela."
        />
      </Head>
      <div className="relative flex h-screen flex-col md:flex-row">
        <div className="md:left absolute left-1/2 left-28 top-6 z-50 -translate-x-1/2 md:left-4 md:top-4 md:-translate-x-0">
          <div
            className="mb-6 flex cursor-pointer items-center"
            onClick={handleReturnToLogin}
          >
            <ChevronLeftIcon className="mr-1 h-5 w-5" />
            <span className="text-sm">Volver al inicio de sesión</span>
          </div>
        </div>

        {/* Sección Izquierda - Formulario */}
        <div className="mt-32 flex w-full flex-col items-center justify-center p-0 md:mt-0 md:w-2/5 md:p-8">
          <div className="flex w-5/6 justify-center md:w-4/6">
            <div className="mx-auto max-w-xl p-4">
              {/* El Stepper indica el progreso */}
              <Stepper
                steps={steps}
                currentStep={currentStep + 1}
                stepSize={40}
                clickable={false}
              />
              <div className="mt-6">{renderStepContent()}</div>
            </div>
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
              src="/images/recover-password-pic.jpeg"
              alt="Recuperar contraseña"
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
              className="pb-6"
              style={{
                fontSize: theme.FontSizes.h3.size,
                color: theme.Colors.textWhite,
              }}
            >
              Recupera tu Contraseña de Forma Segura
            </h2>
            <p
              style={{
                fontSize: theme.FontSizes.s1.size,
                color: theme.Colors.textWhite,
              }}
            >
              En nuestra farmacia en línea, la seguridad de tus datos es nuestra
              prioridad.
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
