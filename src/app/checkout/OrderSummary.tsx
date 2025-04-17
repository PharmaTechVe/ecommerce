// src/components/OrderSummary.tsx
'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Input from '@/components/Input/Input';

interface OrderSummaryProps {
  hideCoupon?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ hideCoupon }) => {
  const { cartItems } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const itemDiscount = cartItems.reduce((acc, item) => {
    if (item.discount) {
      return acc + item.price * item.quantity * (item.discount / 100);
    }
    return acc;
  }, 0);

  const handleApplyCoupon = () => {
    if (couponCode === '1') {
      const newDiscount = (subtotal - itemDiscount) * 0.1;
      setCouponDiscount(newDiscount);
    } else {
      setCouponDiscount(0);
    }
  };

  const tax = (subtotal - itemDiscount - couponDiscount) * 0.16;
  const total = subtotal - itemDiscount - couponDiscount + tax;

  return (
    <aside className="w-full max-w-[412px] space-y-6 p-6 font-['Poppins']">
      {!hideCoupon && (
        <div>
          <p className="mb-2 text-[16px] font-medium text-[#393938]">
            Ingresa el Cupón
          </p>
          <div className="flex gap-4">
            <Input
              value={couponCode}
              placeholder="Código del Cupón"
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              onClick={handleApplyCoupon}
              className="h-[37px] w-[126px] rounded-md bg-[#1C2143] px-7 py-2 text-[16px] text-white"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      <p className="text-[16px] font-medium text-[#393938]">
        Resumen del pedido
      </p>
      <div className="custom-scroll max-h-64 space-y-4 overflow-y-auto pr-1">
        {cartItems.map((item) => {
          const discountedPrice = item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price;
          return (
            <div key={item.id} className="flex items-start gap-4">
              <div className="relative h-24 w-24">
                <Image
                  src={item.image}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="text-[14px] text-[#393938]">{item.name}</p>
                <p className="text-[12px] text-[#6E6D6C]">
                  ${discountedPrice.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="text-right text-sm">
                {item.discount ? (
                  <>
                    <p className="text-[16px] text-[#2ECC71]">
                      ${(discountedPrice * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-[#666666] line-through">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="text-[16px] text-[#393938]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 text-sm text-[#393938]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[#2ECC71]">
          <span>Descuento</span>
          <span>${itemDiscount.toFixed(2)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-[#2ECC71]">
            <span>Descuento Cupón</span>
            <span>${couponDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-[#6E6D6C]">
          <span>IVA (16%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 text-[24px] font-semibold leading-[36px] text-[#393938]">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;
