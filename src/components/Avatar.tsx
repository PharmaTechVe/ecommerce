'use client';

import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Avatar() {
  const pathname = usePathname();

  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* Botón principal (ícono de usuario) */}
      <div>
        <Menu.Button className="flex items-center space-x-2 rounded-full bg-gray-200 p-2 hover:bg-gray-300">
          <UserIcon className="h-6 w-6 text-gray-700" />
        </Menu.Button>
      </div>

      {/* Transición y contenido del menú */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg">
          <div className="p-2">
            <Menu.Item>
              {() => (
                <Link
                  href="/perfil"
                  className={`block rounded-md px-4 py-2 ${
                    pathname === '/perfil'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Perfil
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {() => (
                <Link
                  href="/configuracion"
                  className={`block rounded-md px-4 py-2 ${
                    pathname === '/configuracion'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Configuración
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {() => (
                <button
                  onClick={() => console.log('Cerrando sesión...')}
                  className="block w-full rounded-md px-4 py-2 text-left text-red-600 hover:bg-red-100"
                >
                  Cerrar sesión
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
