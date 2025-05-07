'use client';
import React from 'react';
import { Colors, FontSizes } from '@/styles/styles';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';

export type ProductInfo = {
  productPresentationId: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  stock: number;
};

type ProductModeProps = {
  product: ProductInfo;
  className?: string;
};

type FallbackModeProps = {
  quantity: number;
  onAdd: (e: React.MouseEvent) => void;
  onSubtract: (e: React.MouseEvent) => void;
  className?: string;
};

type CardButtonProps = ProductModeProps | FallbackModeProps;

const CardButton: React.FC<CardButtonProps> = (props) => {
  const { cartItems, addItem, updateItemQuantity, removeItem } = useCart();
  if ('product' in props && props.product) {
    const { product, className } = props;
    const compositeId = `${product.productPresentationId}`;
    const existingItem = cartItems.find((item) => item.id === compositeId);
    const quantity = existingItem ? existingItem.quantity : 0;

    const handleAdd = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          updateItemQuantity(compositeId, existingItem.quantity + 1);
        } else {
          alert('No hay stock suficiente para este producto.');
        }
      } else {
        if (product.stock > 0) {
          addItem({
            id: compositeId,
            name: product.name,
            price: product.price,
            discount: product.discount || 0,
            quantity: 1,
            image: product.image,
            stock: product.stock,
          });
        } else {
          toast.error('Este producto no tiene stock.');
        }
      }
    };

    const handleSubtract = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (existingItem && existingItem.quantity > 1) {
        updateItemQuantity(compositeId, existingItem.quantity - 1);
      } else if (existingItem) {
        removeItem(compositeId);
      }
    };

    const defaultContainerStyles =
      quantity === 0
        ? 'w-[48px] h-[48px] rounded-full'
        : 'w-[129px] h-[48px] rounded-full px-[25px]';

    const containerStyles = className ? className : defaultContainerStyles;

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
  } else {
    const { quantity, onAdd, onSubtract, className } =
      props as FallbackModeProps;
    const defaultContainerStyles =
      quantity === 0
        ? 'w-[48px] h-[48px] rounded-full'
        : 'w-[129px] h-[48px] rounded-full px-[25px]';
    const containerStyles = className ? className : defaultContainerStyles;

    return (
      <div
        className={`${containerStyles} flex items-center overflow-hidden bg-[${Colors.primary}]`}
      >
        {quantity === 0 ? (
          <div
            onClick={onAdd}
            className="font-regular flex flex-1 cursor-pointer select-none items-center justify-center text-white"
            style={{ fontSize: FontSizes.h5.size }}
          >
            <span>+</span>
          </div>
        ) : (
          <>
            <div
              onClick={onSubtract}
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
              onClick={onAdd}
              className="font-regular flex cursor-pointer select-none items-center justify-center text-white"
              style={{ marginLeft: 12, fontSize: FontSizes.h5.size }}
            >
              <span>+</span>
            </div>
          </>
        )}
      </div>
    );
  }
};

export default CardButton;
