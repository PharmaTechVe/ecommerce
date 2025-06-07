'use client';

import Image from 'next/image';
import {
  ChevronRightIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { Colors } from '@/styles/styles';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: Colors.primary }}
      className="px-6 py-12 text-white md:px-16"
    >
      {/* Redes sociales arriba en mobile */}
      <div
        className="mb-8 border-b pb-2 md:hidden"
        style={{ borderColor: Colors.secondaryLight }}
      >
        <div className="flex justify-center gap-6">
          <Link href="https://instagram.com/andres15alvarez">
            <Image
              src="/icons/instagram.svg"
              alt="Instagram"
              width={20}
              height={20}
            />
          </Link>
          <a href="#" aria-label="Facebook">
            <Image
              src="/icons/facebook.svg"
              alt="Facebook"
              width={20}
              height={20}
            />
          </a>
          <a href="#" aria-label="X">
            <Image src="/icons/x.svg" alt="X" width={20} height={20} />
          </a>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-4 md:text-left">
        {/* Logo + Enlaces */}
        <div className="space-y-4">
          <Image
            src="/images/logo-horizontal.svg"
            alt="Pharmatech Logo"
            width={160}
            height={40}
            className="mx-auto md:mx-0"
          />
          {/* Redes sociales en desktop – debajo del botón, alineadas a la izquierda */}
          <div className="hidden md:block">
            <p className="mb-2 mt-4 text-sm">
              Síguenos en nuestras
              <br />
              Redes Sociales
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram">
                <Image
                  src="/icons/instagram.svg"
                  alt="Instagram"
                  width={20}
                  height={20}
                />
              </a>
              <a href="#" aria-label="Facebook">
                <Image
                  src="/icons/facebook.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
              </a>
              <a href="#" aria-label="X">
                <Image src="/icons/x.svg" alt="X" width={20} height={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Nuestras tiendas */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Nuestras tiendas</h4>
          <ul className="space-y-2 text-sm text-gray-200">
            <li className="flex items-center justify-center gap-1 md:justify-start">
              <ChevronRightIcon
                className="h-4 w-4"
                style={{ color: Colors.iconWhite }}
              />
              <Link href="/branch" className="hover:underline">
                Ubicar tienda
              </Link>
            </li>
          </ul>
        </div>

        {/* Categorías */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Compañia</h4>
          <ul className="space-y-2 text-sm text-gray-200">
            <li className="flex items-center justify-center gap-1 md:justify-start">
              <ChevronRightIcon
                className="h-4 w-4"
                style={{ color: Colors.iconWhite }}
              />
              <a href="#" className="hover:underline">
                Sobre Nosotros
              </a>
            </li>
            <li className="flex items-center justify-center gap-1 md:justify-start">
              <ChevronRightIcon
                className="h-4 w-4"
                style={{ color: Colors.iconWhite }}
              />
              <Link href="/contact-us" className="hover:underline">
                Contáctanos
              </Link>
            </li>
          </ul>
        </div>

        {/* Descarga la App + Redes Sociales */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white">¡Descarga la App!</h4>
          <ul className="space-y-2 text-sm text-gray-200">
            {[
              'Comodidad y rapidez',
              'Seguimiento de pedidos',
              'Ofertas exclusivas',
              'Recompra sencilla',
            ].map((benefit) => (
              <li
                key={benefit}
                className="flex items-center justify-center gap-1 md:justify-start"
              >
                <CheckCircleIcon
                  className="h-4 w-4"
                  style={{ color: Colors.iconWhite }}
                />
                {benefit}
              </li>
            ))}
          </ul>

          {/* Botón Descargar */}
          <button
            className="mx-auto flex w-full max-w-[220px] items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#1C2143] transition md:mx-0"
            style={{ backgroundColor: Colors.secondaryLight }}
          >
            Descargar
            <ArrowDownTrayIcon className="h-4 w-4 text-[#1C2143]" />
          </button>
        </div>
      </div>

      {/* Sección legal */}
      <div
        className="mt-10 flex flex-col items-center justify-between border-t pt-4 text-center text-sm text-gray-300 md:flex-row md:text-left"
        style={{ borderColor: Colors.secondaryLight }}
      >
        <p className="mb-2 md:mb-0">
          ©2025 Pharmatech. Todos los derechos reservados
        </p>
        <div className="flex flex-wrap justify-center gap-2 md:justify-start">
          <a href="#" className="hover:underline">
            Política de privacidad
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Términos y condiciones
          </a>
        </div>
      </div>
    </footer>
  );
}
