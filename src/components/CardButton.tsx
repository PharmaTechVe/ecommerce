'use client';
import React, { useState } from 'react';
import { Colors, FontSizes } from '@/styles/styles';

type CartButtonProps = {
  onToggleDetails?: () => void;
  onClick?: () => void;
};

const CartButton: React.FC<CartButtonProps> = ({}) => {
  const [quantity, setQuantity] = useState<number>(0);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  const handleSubtract = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newQuantity = quantity - 1;

    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    } else {
      setQuantity(0);
    }
  };

  const containerStyles =
    quantity === 0
      ? 'w-[48px] h-[48px] rounded-full'
      : 'w-[129px] h-[48px] rounded-full px-[25px]';

  return (
    <div
      className={`${containerStyles} flex items-center overflow-hidden bg-[${Colors.primary}]`}
    >
      {quantity === 0 ? (
        <div
          onClick={handleAdd}
          className="font-regular flex flex-1 cursor-pointer select-none items-center justify-center text-white"
          style={{ fontSize: FontSizes.h5.size }}
        >
          <span>+</span>
        </div>
      ) : (
        <>
          <div
            onClick={handleSubtract}
            className="font-regular flex cursor-pointer select-none items-center justify-center text-white"
            style={{ marginRight: 12, fontSize: FontSizes.h5.size }}
          >
            <span>-</span>
          </div>
          <h5
            className="flex-1 select-none text-center text-white"
            style={{ fontSize: FontSizes.h5.size }}
          >
            {quantity}
          </h5>
          <div
            onClick={handleAdd}
            className="font-regular flex cursor-pointer select-none items-center justify-center text-white"
            style={{ marginLeft: 12, fontSize: FontSizes.h5.size }}
          >
            <span>+</span>
          </div>
        </>
      )}
    </div>
  );
};

export default CartButton;
