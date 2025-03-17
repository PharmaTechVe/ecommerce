'use client';
import React, { useState } from 'react';
import { Colors } from '@/styles/styles';

type CartButtonProps = {
  size?: 'default' | 'compact';
  onToggleDetails?: (isHidden: boolean) => void;
};

const CartButton: React.FC<CartButtonProps> = ({
  size = 'default',
  onToggleDetails,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);

    if (!isHidden && newQuantity === 1) {
      setIsHidden(true);
      onToggleDetails?.(true);
    }
  };

  const handleSubtract = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newQuantity = quantity - 1;

    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    } else {
      setQuantity(0);
      if (isHidden) {
        setIsHidden(false);
        onToggleDetails?.(false);
      }
    }
  };

  const buttonStyles = {
    default: 'w-38 h-12',
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
