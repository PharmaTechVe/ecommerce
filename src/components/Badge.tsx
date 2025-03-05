'use client';
import React from 'react';
import '../styles/globals.css';
export interface BadgeProps {
  variant: 'filled' | 'outlined' | 'text';
  color: 'primary' | 'warning' | 'danger' | 'success' | 'info';
  size: 'small' | 'medium' | 'large';
  borderRadius?: 'rounded' | 'square';
  children: React.ReactNode;
}
const Badge: React.FC<BadgeProps> = ({
  variant,
  color,
  size,
  borderRadius = 'rounded',
  children,
}) => {
  const baseStyle = 'font-poppins px-4 py-2';
  const sizeStyle =
    size === 'small'
      ? 'text-sm mt-2'
      : size === 'medium'
        ? 'text-base'
        : 'text-lg';
  const borderRadiusStyle =
    borderRadius === 'rounded' ? 'rounded-full' : 'rounded-md';

  const colorClasses: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#1C2143',
      color: '#FFFFFF',
      borderColor: '##1C2143',
    },
    warning: {
      backgroundColor: '#FFD569',
      color: '#FFFFFF',
      borderColor: '#FFD569',
    },
    danger: {
      backgroundColor: '#F23030',
      color: '#FFFFFF',
      borderColor: '#F23030',
    },
    success: {
      backgroundColor: '#22AD5C',
      color: '#FFFFFF',
      borderColor: '#22AD5C',
    },
    info: {
      backgroundColor: '#A3E4D7',
      color: '#FFFFFF',
      borderColor: '#A3E4D7',
    },
  };
  const outlinedClasses: Record<string, React.CSSProperties> = {
    primary: {
      color: '#1C2143',
      border: '1px solid #1C2143',
    },
    warning: {
      color: '#FFD569',
      border: '1px solid #FFD569',
    },
    danger: {
      color: '#F23030',
      border: '1px solid #F23030',
    },
    success: {
      color: '#22AD5C',
      border: '1px solid #22AD5C',
    },
    info: {
      color: '#01A9DB',
      border: '1px solid #A3E4D7',
    },
  };
  const textClasses: Record<string, React.CSSProperties> = {
    primary: { color: '#1C2143' },
    warning: { color: '#FFD569' },
    danger: { color: '#F23030' },
    success: { color: '#22AD5C' },
    info: { color: '#A3E4D7' },
  };
  const variantStyle = {
    filled: colorClasses[color],
    outlined: outlinedClasses[color],
    text: textClasses[color],
  };
  return (
    <span
      className={`${baseStyle} ${sizeStyle} ${borderRadiusStyle}`}
      style={variantStyle[variant]}
    >
      {children}
    </span>
  );
};
export default Badge;
