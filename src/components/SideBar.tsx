'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRightEndOnRectangleIcon,
  UserIcon,
  MapIcon,
  LockClosedIcon,
  ShoppingCartIcon,
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
  user: SidebarUser;
  menuItems?: SidebarMenuItem[];
  onLogout?: () => void;
  className?: string;
  isOpen?: boolean;
  children?: React.ReactNode;
}

// Menu por defecto
const defaultMenuItems: SidebarMenuItem[] = [
  {
    id: 'profile',
    label: 'Mi Perfil',
    href: '/profile', // toma la ruta actual pendiente en revision
    icon: <UserIcon className="h-5 w-5" />,
  },
  {
    id: 'addresses',
    label: 'Mis Direcciones',
    href: '/addresses',
    icon: <MapIcon className="h-5 w-5" />,
  },
  {
    id: 'security',
    label: 'Seguridad',
    href: '/security',
    icon: <LockClosedIcon className="h-5 w-5" />,
  },
  {
    id: 'orders',
    label: 'Mis Pedidos',
    href: '/orders',
    icon: <ShoppingCartIcon className="h-5 w-5" />,
  },
];

export function Sidebar({
  user,
  menuItems = defaultMenuItems,
  onLogout,
  className = '',
  isOpen = false,
  children,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={` ${isOpen ? 'flex' : 'hidden'} w-72 flex-col rounded-lg bg-transparent p-6 md:flex ${className} `}
    >
      {/* Botón de cerrar (visible solo en mobile si se pasa en children) */}
      {children}

      {/* User Info */}
      <div className="mb-6 flex items-center gap-3">
        <Avatar
          name={user.name}
          imageUrl={user.avatar}
          size={48}
          withDropdown={false}
        />
        <div>
          <h3 className="font-medium text-[#393938]">{user.name}</h3>
          <p className="text-sm text-[#6e6d6c]">{user.role}</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          let isActive = pathname === item.href;

          if (item.id === 'profile' && pathname.startsWith('/user/')) {
            isActive = true;
          }

          const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-md';
          const activeClasses = `
            border-l-[3px]
            border-[#374CBE]
            text-[#374CBE]
            bg-white
          `;
          const inactiveClasses = 'text-[#6e6d6c] hover:bg-[#f1f6fa]';

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${baseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`}
            >
              {item.icon}
              <span className={isActive ? 'font-medium' : ''}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      {onLogout && (
        <div className="mt-auto pt-32">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 font-medium text-[#d31510]"
          >
            <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}
