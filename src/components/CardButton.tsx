'use client';
import React, { useState } from 'react';
import { Colors } from '@/styles/styles';

type CartButtonProps = {
  size?: 'default' | 'compact';
};

const CartButton: React.FC<CartButtonProps> = ({ size = 'default' }) => {
  const [quantity, setQuantity] = useState<number>(0);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(quantity + 1);
  };

  const handleSubtract = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) setQuantity(quantity - 1);
    else setQuantity(0);
  };

  // Estilos  según el tamaño
  const buttonStyles = {
    default: 'w-32 h-10',
    compact: 'w-20 h-6',
  };

  const containerStyles =
    quantity === 0
      ? 'w-10 h-10 rounded-full'
      : `w-32 h-10 ${buttonStyles[size]} rounded-full`;

  return (
    <div
      className={`${containerStyles} flex items-center overflow-hidden bg-[${Colors.primary}]`}
    >
      {quantity === 0 ? (
        <div
          onClick={handleAdd}
          className="flex flex-1 cursor-pointer select-none items-center justify-center text-white"
        >
          +
        </div>
      ) : (
        <>
          <div
            onClick={handleSubtract}
            className="flex flex-1 cursor-pointer select-none items-center justify-center text-white"
          >
            -
          </div>
          <div className="flex flex-1 select-none items-center justify-center text-white">
            {quantity}
          </div>
          <div
            onClick={handleAdd}
            className="flex flex-1 cursor-pointer select-none items-center justify-center text-white"
          >
            +
          </div>
        </>
      )}
    </div>
  );
};

export default CartButton;
