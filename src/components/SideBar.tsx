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
    href: `/user/addresses`,
    icon: <MapIcon className="h-5 w-5" />,
  },
  {
    id: 'security',
    label: 'Seguridad',
    href: `/user/security/updatePassword`,
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
  isOpen = false,
  children,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={` ${isOpen ? 'flex' : 'hidden'} ml-6 w-72 flex-col rounded-lg bg-[#F1F5FD] p-4 md:flex ${className} `}
    >
      {/* Botón de cerrar en mobile */}
      {children}

      {/* Info del usuario */}
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

      {/* Menú de navegación */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== `/user`);

          const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-md';

          const activeClasses = `
      border-l-[3px]
      border-[#374CBE]
      text-[#374CBE]
      bg-white
      font-medium
    `;

          const inactiveClasses = `
      text-[#6e6d6c]
      hover:bg-[#f1f6fa]
      hover:text-[#374CBE]
    `;

          const finalClasses = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

          return (
            <Link key={item.id} href={item.href} className={finalClasses}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Botón de cerrar sesión */}
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
