'use client';
import React from 'react';
import '../styles/globals.css';
import { Colors } from '../styles/styles';

export interface BadgeProps {
  variant: 'filled' | 'outlined' | 'text';
  color: 'primary' | 'tertiary' | 'warning' | 'danger' | 'success' | 'info';
  size: 'small' | 'medium' | 'large';
  borderRadius?: 'rounded' | 'square';
  className?: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant,
  color,
  size,
  borderRadius = 'rounded',
  className,
  children,
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-poppins select-none px-4 py-2 whitespace-nowrap w-fit';
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
      backgroundColor: Colors.primary,
      color: Colors.textWhite,
      borderColor: Colors.primary,
    },
    tertiary: {
      backgroundColor: Colors.secondaryLight,
      color: Colors.textWhite,
      borderColor: Colors.secondaryLight,
    },
    warning: {
      backgroundColor: Colors.semanticWarning,
      color: Colors.textWhite,
      borderColor: Colors.semanticWarning,
    },
    danger: {
      backgroundColor: Colors.semanticDanger,
      color: Colors.textWhite,
      borderColor: Colors.semanticDanger,
    },
    success: {
      backgroundColor: Colors.semanticSuccess,
      color: Colors.textWhite,
      borderColor: Colors.semanticSuccess,
    },
    info: {
      backgroundColor: Colors.semanticInfo,
      color: Colors.textWhite,
      borderColor: Colors.semanticInfo,
    },
  };

  const outlinedClasses: Record<string, React.CSSProperties> = {
    primary: {
      color: Colors.primary,
      border: `1px solid ${Colors.primary}`,
    },
    tertiary: {
      color: Colors.secondaryLight,
      border: `1px solid ${Colors.secondaryLight}`,
    },
    warning: {
      color: Colors.semanticWarning,
      border: `1px solid ${Colors.semanticWarning}`,
    },
    danger: {
      color: Colors.semanticDanger,
      border: `1px solid ${Colors.semanticDanger}`,
    },
    success: {
      color: Colors.semanticSuccess,
      border: `1px solid ${Colors.semanticSuccess}`,
    },
    info: {
      color: Colors.semanticInfo,
      border: `1px solid ${Colors.semanticInfo}`,
    },
  };

  const textClasses: Record<string, React.CSSProperties> = {
    primary: { color: Colors.primary },
    warning: { color: Colors.semanticWarning },
    danger: { color: Colors.semanticDanger },
    success: { color: Colors.semanticSuccess },
    info: { color: Colors.semanticInfo },
  };

  const styleByVariant = {
    filled: colorClasses[color],
    outlined: outlinedClasses[color],
    text: textClasses[color],
  };

  return (
    <span
      className={`${baseStyle} ${sizeStyle} ${borderRadiusStyle} ${className ?? ''}`}
      style={styleByVariant[variant]}
    >
      {children}
    </span>
  );
};

export default Badge;
