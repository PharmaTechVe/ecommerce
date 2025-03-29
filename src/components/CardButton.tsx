'use client';
import React, { useState } from 'react';
import { Colors, FontSizes } from '@/styles/styles';

type CartButtonProps = {
  quantity?: number;
  onToggleDetails?: () => void;
  onAdd?: () => void;
  onSubtract?: () => void;
  className?: string;
};

const CartButton: React.FC<CartButtonProps> = ({
  quantity: externalQuantity,
  onAdd,
  onSubtract,
  className,
}) => {
  const [internalQuantity, setInternalQuantity] = useState<number>(0);
  const quantity =
    externalQuantity !== undefined ? externalQuantity : internalQuantity;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (externalQuantity === undefined) {
      const newQuantity = internalQuantity + 1;
      setInternalQuantity(newQuantity);
    }
    if (onAdd) {
      onAdd();
    }
  };

  const handleSubtract = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (externalQuantity === undefined) {
      const newQuantity = internalQuantity - 1;
      if (newQuantity >= 1) {
        setInternalQuantity(newQuantity);
      } else {
        setInternalQuantity(0);
      }
    }
    if (onSubtract) {
      onSubtract();
    }
  };

  const defaultContainerStyles =
    quantity === 0
      ? 'w-[48px] h-[48px] rounded-full'
      : 'w-[129px] h-[48px] rounded-full px-[25px]';

  const containerStyles = className ? className : defaultContainerStyles;

  return (
    <div
      className={`${containerStyles} flex items-center overflow-hidden bg-[${Colors.primary}] ${className}`}
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
