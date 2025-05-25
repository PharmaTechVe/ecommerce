'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/styles/styles';
import { useCart } from '@/context/CartContext';

export type AvatarProps = {
  name: string;
  imageUrl?: string;
  size?: number;
  withDropdown?: boolean;
  dropdownOptions?: { label: string; route?: string }[];
  onProfileClick?: () => void;
  withSemicircle?: boolean;
  semicircleColor?: string;
  semicircleSize?: number;
};

export default function Avatar({
  name,
  imageUrl,
  size = 48,
  withDropdown = false,
  dropdownOptions = [],
  onProfileClick,
  withSemicircle = false,
  semicircleColor = '#FFFFFF',
  semicircleSize,
}: AvatarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout, token } = useAuth();
  const { clearCart } = useCart();

  const initials = name
    .split(' ')
    .map((word) => word[0]?.toUpperCase() || '')
    .join('');

  const handleToggleDropdown = () => {
    if (withDropdown) setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (route?: string) => {
    if (route) router.push(route);
    setDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    clearCart();
    setDropdownOpen(false);
  };

  const handleSafeProfileClick = () => {
    if (onProfileClick) {
      setDropdownOpen(false);
      onProfileClick();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
      ref={dropdownRef}
    >
      {/* Semicírculo detrás del avatar */}
      {withSemicircle && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2 rounded-full"
          style={{
            width: semicircleSize ?? size,
            height: semicircleSize ?? size,
            backgroundColor: semicircleColor,
            zIndex: 0,
          }}
        />
      )}

      {/* Avatar */}
      <div
        className="relative z-10 flex cursor-pointer items-center justify-center overflow-hidden rounded-full"
        style={{ width: size, height: size, background: Colors.primary }}
        onClick={handleToggleDropdown}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="rounded-full object-cover"
            sizes={`${size}px`}
          />
        ) : (
          <span style={{ fontSize: size * 0.4, color: Colors.textWhite }}>
            {initials || '?'}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {withDropdown && dropdownOpen && token && (
        <div className="absolute left-0 right-auto z-10 mt-2 w-40 rounded-md bg-white shadow-lg md:left-auto md:right-0">
          <ul className="py-1">
            {onProfileClick && (
              <li
                className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleSafeProfileClick}
              >
                Ir a mi perfil
              </li>
            )}
            {dropdownOptions.map((option) => (
              <li
                key={option.label}
                className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleOptionClick(option.route)}
              >
                {option.label}
              </li>
            ))}
            <li
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleLogoutClick}
            >
              Cerrar sesión
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
