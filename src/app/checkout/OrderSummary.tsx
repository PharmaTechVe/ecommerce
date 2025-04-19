// src/components/OrderSummary.tsx
'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Input from '@/components/Input/Input';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import { Colors } from '@/styles/styles';

interface OrderSummaryProps {
  hideCoupon?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ hideCoupon }) => {
  const { cartItems } = useCart();
  const { token } = useAuth();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);

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

  const handleApplyCoupon = async () => {
    if (!token) {
      setCouponError('Debe iniciar sesión para aplicar cupones');
      return;
    }
    try {
      const coupon = await api.coupon.getByCode(couponCode.trim(), token);
      const { discount, minPurchase, expirationDate } = coupon;
      if (subtotal < minPurchase) {
        setCouponError(`Compra mínima de $${minPurchase.toFixed(2)}`);
        setCouponDiscount(0);
        return;
      }
      if (new Date(expirationDate) < new Date()) {
        setCouponError('Cupón expirado');
        setCouponDiscount(0);
        return;
      }
      const newDiscount = (subtotal - itemDiscount) * (discount / 100);
      setCouponDiscount(newDiscount);
      setCouponError(null);
    } catch {
      setCouponError('Cupón inválido');
      setCouponDiscount(0);
    }
  };

  const tax = (subtotal - itemDiscount - couponDiscount) * 0.16;
  const total = subtotal - itemDiscount - couponDiscount + tax;

  return (
    <aside className="w-full max-w-[412px] space-y-6 rounded-md border border-gray-200 bg-white p-6 font-['Poppins'] shadow-sm">
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
              borderSize="1px"
              borderColor={Colors.stroke}
            />
            <button
              onClick={handleApplyCoupon}
              className="h-[37px] w-[126px] rounded-md bg-[#1C2143] px-7 py-2 text-[16px] text-white"
            >
              Aplicar
            </button>
          </div>
          {couponError && (
            <p className="mt-1 text-sm text-red-600">{couponError}</p>
          )}
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
            <div key={item.id} className="flex items-start gap-4 border-b pb-4">
              <div className="relative h-24 w-24">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-[14px] text-[#393938]">{item.name}</p>
                <p className="text-[12px] text-[#6E6D6C]">
                  ${discountedPrice.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="text-right">
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

      <div className="space-y-2 text-[16px] text-[#393938]">
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
