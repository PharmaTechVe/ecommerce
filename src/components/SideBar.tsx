'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRightEndOnRectangleIcon,
  UserIcon,
  MapIcon,
  LockClosedIcon,
  ShoppingCartIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import Avatar from '@/components/Avatar';

export type SidebarMenuItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type SidebarUser = {
  name: string;
  role: string;
  avatar: string;
};

interface SidebarProps {
  user: SidebarUser | null;
  menuItems?: SidebarMenuItem[];
  onLogout?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const getDefaultMenuItems = (): SidebarMenuItem[] => [
  {
    id: 'profile',
    label: 'Mi Perfil',
    href: `/user`,
    icon: <UserIcon className="h-5 w-5" />,
  },
  {
    id: 'addresses',
    label: 'Mis Direcciones',
    href: `/user/address`,
    icon: <MapIcon className="h-5 w-5" />,
  },
  {
    id: 'security',
    label: 'Seguridad',
    href: `/user/security/update-password`,
    icon: <LockClosedIcon className="h-5 w-5" />,
  },
  {
    id: 'orders',
    label: 'Mis Pedidos',
    href: `/user/orders`,
    icon: <ShoppingCartIcon className="h-5 w-5" />,
  },
];

export function Sidebar({
  user,
  menuItems = getDefaultMenuItems(),
  onLogout,
  className = '',
}: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderMenuItems = () =>
    menuItems.map((item) => {
      const isActive =
        pathname === item.href ||
        (pathname.startsWith(item.href) && item.href !== `/user`);

      const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-md';
      const activeClasses =
        'border-l-[3px] border-[#374CBE] text-[#374CBE] bg-white font-medium';
      const inactiveClasses =
        'text-[#6e6d6c] hover:bg-[#f1f6fa] hover:text-[#374CBE]';

      const finalClasses = `${baseClasses} ${
        isActive ? activeClasses : inactiveClasses
      }`;

      return (
        <Link key={item.id} href={item.href} className={finalClasses}>
          {item.icon}
          <span>{item.label}</span>
        </Link>
      );
    });

  return (
    <>
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-md bg-white p-2 shadow md:hidden"
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-controls="sidebar"
        >
          <Bars3Icon className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {(isOpen || !isMobile) && (
        <div
          id="sidebar"
          className={`${
            isMobile
              ? 'fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-lg'
              : 'min-h-[582px] w-[269px]'
          } flex flex-col justify-between overflow-y-auto rounded-lg bg-[#F1F5FD] p-4 pb-6 pt-4 ${className}`}
        >
          <div>
            {isMobile && (
              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="mb-2 p-1 text-gray-600 hover:text-red-500"
                  aria-label="Cerrar menú"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            )}

            <div className="mb-6 flex items-center gap-3">
              <Avatar
                name={user?.name || ''}
                imageUrl={user?.avatar || ''}
                size={48}
                withDropdown={false}
              />
              <div>
                <h3 className="font-medium text-[#393938]">{user?.name}</h3>
                <p className="text-sm text-[#6e6d6c]">Cuenta Personal</p>
              </div>
            </div>

            <nav className="space-y-1">{renderMenuItems()}</nav>
          </div>

          {onLogout && (
            <div className="pt-6">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 font-medium text-[#d31510] transition-all duration-200 ease-in-out hover:scale-105 hover:text-red-600"
              >
                <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
