'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

export type SidebarMenuItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
};

export type SidebarUser = {
  name: string;
  role: string;
  avatar: string;
};

interface SidebarProps {
  user: SidebarUser;
  menuItems: SidebarMenuItem[];
  onLogout?: () => void;
  className?: string;
}

export function Sidebar({
  user,
  menuItems,
  onLogout,
  className = '',
}: SidebarProps) {
  return (
    <div
      className={`flex w-72 flex-col rounded-lg bg-[#f5f5f5] p-6 ${className}`}
    >
      {/* User Info */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={user.avatar || '/placeholder.svg?height=48&width=48'}
            width={48}
            height={48}
            alt={`${user.name} avatar`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-[#393938]">{user.name}</h3>
          <p className="text-sm text-[#6e6d6c]">{user.role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const baseClasses = 'flex items-center gap-3 px-4 py-3 rounded-md';
          const activeClasses =
            'bg-[#e2f4ff] border-l-4 border-[#0265dc] text-[#0265dc]';
          const inactiveClasses = 'text-[#6e6d6c] hover:bg-[#f1f6fa]';
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${baseClasses} ${item.isActive ? activeClasses : inactiveClasses}`}
            >
              {item.icon}
              <span className={item.isActive ? 'font-medium' : ''}>
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
