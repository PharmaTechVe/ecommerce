import React from 'react';
import '../styles/globals.css';
type ButtonProps = {
  children: React.ReactNode;
  color?: string;
  paddingX?: number;
  paddingY?: number;
  textSize?: string;
  customWidth?: string;
  customHeight?: string;
  buttonType?: 'submit';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'submit' | 'white';
};

const Button: React.FC<ButtonProps> = ({
  children,
  color = '#1C2143',
  paddingX = 4,
  paddingY = 2,
  textSize = 'base',
  customWidth = 'auto',
  customHeight = 'auto',
  buttonType = 'submit',
  onClick,
  disabled = false,
  className = '',
  variant = 'submit',
}) => {
  const baseStyles = `font-medium transition duration-200 rounded-md shadow-sm border-transparent px-${paddingX} py-${paddingY} text-${textSize}`;

  const variantStyles =
    variant === 'white'
      ? `bg-white text-main border-2 border-[#1C2143] hover:bg-[#1C2143] hover:text-main`
      : `bg-${color} text-white border-none`;

  const disabledStyles = disabled
    ? 'cursor-not-allowed opacity-50 bg-gray-300 text-black border-none'
    : '';

  return (
    <button
      type={buttonType}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled
          ? '#D3D3D3'
          : variant === 'white'
            ? 'white'
            : color,
        color: disabled
          ? 'black'
          : variant === 'white'
            ? 'text-main'
            : 'text-main',
        width: customWidth,
        height: customHeight,
        border: variant === 'white' ? '2px solid #1C2143' : 'none',
      }}
      className={`${baseStyles} ${variantStyles} ${disabledStyles} hover:opacity-30 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
