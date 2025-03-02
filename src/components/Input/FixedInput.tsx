'use client';

import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Tipo específico para los iconos (debe ser un componente de React)
type IconType = React.FC<React.SVGProps<SVGSVGElement>>;

interface InputProps {
  label?: string;
  placeholder?: string;
  icon?: IconType;
  iconColor?: string;
  iconPosition?: 'left' | 'right';
  helperText?: string;
  helperTextColor?: string;
  disabled?: boolean;
  type?: 'text' | 'password' | 'email' | 'number';
  showPasswordToggle?: boolean;
  showPasswordToggleIconColor?: string;
  borderSize?: string;
  borderColor?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Función para modificar el color (aclarar u oscurecer)
const adjustColor = (color: string, amount: number) => {
  let usePound = false;
  if (color.startsWith('#')) {
    color = color.slice(1);
    usePound = true;
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);

  return (
    (usePound ? '#' : '') +
    ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
  );
};

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  icon: Icon,
  iconColor = 'text-gray-500',
  iconPosition = 'left',
  helperText,
  helperTextColor = 'text-gray-500',
  disabled = false,
  type = 'text',
  showPasswordToggle = false,
  showPasswordToggleIconColor = 'text-gray-500',
  borderSize = '2px',
  borderColor = '#000000',
  onChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleToggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Calcular colores dinámicos para hover y focus
  const hoverBorderColor = adjustColor(borderColor, 40); // Aclara el color en hover
  const focusBorderColor = adjustColor(borderColor, -40); // Oscurece el color en focus

  return (
    <div className="flex w-full flex-col">
      {label && (
        <label className="mb-1 font-medium text-gray-700">{label}</label>
      )}

      <div
        className="relative flex items-center rounded-lg border bg-white px-3 py-2 transition-all"
        style={{
          borderWidth: borderSize,
          borderColor: disabled
            ? '#d1d5db'
            : isFocused
              ? focusBorderColor
              : isHovered
                ? hoverBorderColor
                : borderColor,
        }}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => !disabled && setIsHovered(false)}
      >
        {/* Icono a la izquierda */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 h-5 w-5" style={{ color: iconColor }}>
            <Icon className="h-5 w-5" />
          </div>
        )}

        <input
          type={
            showPasswordToggle ? (passwordVisible ? 'text' : 'password') : type
          }
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onFocus={() => !disabled && setIsFocused(true)}
          onBlur={() => !disabled && setIsFocused(false)}
          className={`w-full bg-transparent outline-none ${
            disabled ? 'cursor-not-allowed text-gray-400' : 'text-black'
          } ${Icon && iconPosition === 'left' ? 'pl-10' : ''} ${Icon && iconPosition === 'right' ? 'pr-10' : ''}`}
        />

        {/* Icono a la derecha */}
        {Icon && iconPosition === 'right' && (
          <div
            className="absolute right-3 h-5 w-5"
            style={{ color: iconColor }}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}

        {/* Botón para ver/ocultar contraseña */}
        {showPasswordToggle && !disabled && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={handleToggleVisibility}
            style={{ color: showPasswordToggleIconColor }} // Aplica el color correctamente
          >
            {passwordVisible ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Texto de ayuda */}
      {helperText && (
        <p className="mt-1 text-sm" style={{ color: helperTextColor }}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
