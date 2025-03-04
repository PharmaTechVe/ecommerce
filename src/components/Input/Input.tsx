'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import theme from '@/styles/styles';

interface InputProps {
  label?: string;
  borderSize?: string;
  borderColor?: string;
  placeholder?: string;
  icon?: LucideIcon;
  iconColor?: string;
  helperText?: string;
  helperTextColor?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  borderSize = '1px',
  borderColor = 'gray',
  placeholder = '',
  icon: Icon,
  iconColor = 'gray',
  helperText = '',
  helperTextColor = 'gray',
  onChange,
}) => {
  return (
    <div className="flex w-full flex-col bg-white text-black">
      {label && (
        <label
          className="mb-1 font-medium"
          style={{
            color: theme.Colors.textMain,
          }}
        >
          {label}
        </label>
      )}
      <div
        className="relative flex items-center rounded-lg px-3 py-2"
        style={{ border: `${borderSize} solid ${borderColor}` }}
      >
        <input
          type="text"
          placeholder={placeholder}
          className="w-full outline-none"
          onChange={onChange}
        />
        {Icon && <Icon className="mr-2" color={iconColor} />}
      </div>
      {helperText && (
        <p className="mt-1 text-sm" style={{ color: helperTextColor }}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
