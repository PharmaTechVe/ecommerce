import React from 'react';

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
  const baseStyle = 'font-bold px-4 py-2 ';
  const sizeStyle =
    size === 'small'
      ? 'text-sm mt-2'
      : size === 'medium'
        ? 'text-base'
        : 'text-lg';
  const borderRadiusStyle =
    borderRadius === 'rounded' ? 'rounded-full' : 'rounded-md';

  const colorClasses: Record<string, string> = {
    primary: 'bg-blue-950 text-white border-blue-950',
    warning: 'bg-yellow-200 text-white border-yellow-200',
    danger: 'bg-red-500 text-white border-red-500',
    success: 'bg-green-300 text-white border-green-300',
    info: 'bg-teal-100 text-white border-teal-100',
  };

  const outlinedClasses: Record<string, string> = {
    primary: 'text-blue-950 border-blue-950',
    warning: 'text-yellow-200 border-yellow-200',
    danger: 'text-red-500 border-red-500',
    success: 'text-green-300 border-green-300',
    info: 'text-teal-100 border-teal-100',
  };

  const textClasses: Record<string, string> = {
    primary: 'text-blue-950',
    warning: 'text-yellow-200',
    danger: 'text-red-500',
    success: 'text-green-300',
    info: 'text-teal-100',
  };

  const variantStyle = {
    filled: colorClasses[color],
    outlined: `border ${outlinedClasses[color]}`,
    text: textClasses[color],
  };

  return (
    <span
      className={`${baseStyle} ${sizeStyle} ${borderRadiusStyle} ${variantStyle[variant]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
