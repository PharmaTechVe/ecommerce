'use client';
import React from 'react';
import Image from 'next/image';
import { CartItem } from '@/context/CartContext';
import CardButton from '../CardButton';
import { TrashIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '@/lib/utils/helpers/priceFormatter';

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
    <div className="flex items-center space-x-4 border-b border-gray-100 py-2">
      <div className="relative h-20 w-20 flex-shrink-0">
        {discount > 0 && (
          <div className="absolute -left-1 -top-1 z-10">
            <div className="items-center justify-center rounded-full bg-[#FFD569] px-3 py-1">
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
        <h4 className="mt-1 text-lg font-normal text-gray-800">{item.name}</h4>
        <p className="mt-3 text-gray-600">(${formatPrice(item.price)} c/u)</p>

        <div className="mt-3 [&_.FontSizes_h5]:!text-sm [&_h5]:!text-sm [&_span]:!text-sm">
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
            <span className="font-semibold">
              ${formatPrice(discountedTotal)}
            </span>
            <span className="text-gray-500 line-through">
              ${formatPrice(originalTotal)}
            </span>
          </>
        ) : (
          <span className="font-semibold">${formatPrice(originalTotal)}</span>
        )}
        <button
          onClick={() => onRemove(item.id)}
          className="text-[#FF5959] md:hidden"
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="ml-4 hidden text-[#FF5959] md:block"
      >
        <TrashIcon className="h-6 w-6" />
      </button>
    </div>
  );
};
export default CartItemComponent;
