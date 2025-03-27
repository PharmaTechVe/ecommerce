'use client';
import React from 'react';
import Image from 'next/image';
import { CartItem } from '@/contexts/CartContext';
import CardButton from '../CardButton';
import { TrashIcon } from '@heroicons/react/24/outline';

interface CartItemProps {
  item: CartItem;
  onChangeQuantity: (id: string, increment: number) => void;
  onRemove: (id: string) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onChangeQuantity,
  onRemove,
}) => {
  const handleAdd = () => {
    onChangeQuantity(item.id, 1);
  };

  const handleSubtract = () => {
    if (item.quantity > 1) {
      onChangeQuantity(item.id, -1);
    } else {
      onRemove(item.id);
    }
  };

  const discount = item.discount || 0;
  const originalTotal = item.price * item.quantity;
  const discountedTotal =
    discount > 0 ? originalTotal * (1 - discount / 100) : originalTotal;

  return (
    <div className="flex items-center space-x-4 border-b border-gray-200 py-4">
      {/* Contenedor de imagen con badge */}
      <div className="relative h-20 w-20 flex-shrink-0">
        {/* Badge de descuento */}
        {discount > 0 && (
          <div className="absolute -left-1 -top-1 z-10">
            <div className="flex items-center justify-center rounded-full bg-[#FFD569] px-3 py-1">
              <span className="text-sm font-medium leading-none text-black">
                -{discount}%
              </span>
            </div>
          </div>
        )}
        <Image
          src={item.image}
          alt={item.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      <div className="flex-grow">
        <h4 className="text-lg font-medium font-normal text-gray-800">
          {item.name}
        </h4>
        <p className="text-gray-600">(${item.price.toFixed(2)} c/u)</p>

        <div className="[&_.FontSizes_h5]:!text-sm [&_h5]:!text-sm [&_span]:!text-sm">
          <CardButton
            quantity={item.quantity}
            onAdd={handleAdd}
            onSubtract={handleSubtract}
            className="flex h-[32px] w-[152px] items-center justify-center gap-[36px] rounded-[50px] pb-[12px] pl-[18px] pr-[18px] pt-[12px]"
          />
        </div>
      </div>

      <div className="mr-4 flex flex-col items-end">
        {discount > 0 ? (
          <>
            <span className="font-semibold">${discountedTotal.toFixed(2)}</span>
            <span className="text-gray-500 line-through">
              ${originalTotal.toFixed(2)}
            </span>
          </>
        ) : (
          <span className="font-semibold">${originalTotal.toFixed(2)}</span>
        )}
      </div>

      <button onClick={() => onRemove(item.id)} className="text-red-500">
        <TrashIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default CartItemComponent;
