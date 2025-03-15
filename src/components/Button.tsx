import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import '../styles/globals.css';
import { Colors } from '../styles/styles';

type ButtonProps = {
  children: React.ReactNode;
  color?: string;
  paddingX?: number;
  paddingY?: number;
  textSize?: string;
  width?: string;
  height?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'submit' | 'white' | 'light' | 'icon' | 'gray';
  textColor?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  color = `${Colors.primary}`,
  paddingX = 4,
  paddingY = 2,
  textSize = 'base',
  width = '100%',
  height = 'auto',
  onClick,
  disabled = false,
  className = '',
  variant = 'submit',
  textColor = 'white',
}) => {
  const baseStyles = `font-medium transition duration-200 rounded-md shadow-sm border-transparent px-${paddingX} py-${paddingY} text-${textSize}`;

  const variantStyles =
    variant === 'white'
      ? `bg-white text-main border-2 border-[${Colors.primary}] hover:bg-[${Colors.primary}] hover:text-main`
      : variant === 'light'
        ? `bg-button-variant-color text-${Colors.textHighContrast} border-none hover:bg-opacity-60`
        : variant === 'icon'
          ? `bg-${color} text-${textColor} border-none flex items-center justify-center space-x-4`
          : variant === 'gray'
            ? `bg-[#6B7280] text-white border-none`
            : `bg-${color} text-${textColor} border-none`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled
          ? `${Colors.disabled}`
          : variant === 'white'
            ? 'white'
            : variant === 'light'
              ? `${Colors.secondaryLight}`
              : variant === 'gray'
                ? `${Colors.neuter}`
                : color,
        color: disabled
          ? `${Colors.textHighContrast}`
          : variant === 'white'
            ? `${Colors.textMain}`
            : variant === 'light'
              ? `${Colors.textHighContrast}`
              : variant === 'gray'
                ? 'white'
                : textColor,
        width: width,
        height: height,
        border: variant === 'white' ? `2px solid ${Colors.primary}` : 'none',
      }}
      className={`${baseStyles} ${variantStyles} ${
        disabled
          ? 'cursor-not-allowed border-none bg-gray-300 text-black opacity-50'
          : ''
      } hover:opacity-50 ${className}`}
    >
      {variant === 'icon' && (
        <PlusCircleIcon
          style={{
            width: textSize === 'base' ? 20 : 24,
            height: textSize === 'base' ? 20 : 24,
          }}
        />
      )}
      {children}
    </button>
  );
};

export default Button;
