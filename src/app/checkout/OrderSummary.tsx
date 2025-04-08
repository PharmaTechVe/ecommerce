'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Input from '@/components/Input/Input';
import Button from '@/components/Button';

const OrderSummary: React.FC = () => {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const discount = cartItems.reduce((acc, item) => {
    if (item.discount) {
      return acc + item.price * item.quantity * (item.discount / 100);
    }
    return acc;
  }, 0);
  const tax = (subtotal - discount) * 0.16;
  const total = subtotal - discount + tax;
  const [couponCode, setCouponCode] = useState('');

  return (
    <aside className="space-y-6 p-6">
      {/* Cupón */}
      <div>
        <p className="mb-2 font-medium text-gray-800">Ingresa el Cupón</p>
        <div className="flex gap-2">
          <Input
            value={couponCode}
            placeholder="Código del Cupón"
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <Button variant="submit" width="auto" height="auto" className="px-4">
            Aplicar
          </Button>
        </div>
      </div>

      {/* Productos */}
      <p className="font-medium text-gray-800">Resumen del pedido</p>
      <div className="custom-scroll max-h-64 space-y-4 overflow-y-auto pr-1">
        {cartItems.map((item) => {
          const discountedPrice = item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price;

          return (
            <div key={item.id} className="flex items-start gap-4">
              <div className="relative h-[64px] w-[64px]">
                <Image
                  src={item.image}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ${discountedPrice.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="text-right text-sm">
                {item.discount ? (
                  <>
                    <p className="font-medium text-gray-800">
                      ${(discountedPrice * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 line-through">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="font-medium text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Totales */}
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Descuento</span>
          <span>${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>IVA (16%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Botón */}
      <Button
        variant="submit"
        width="100%"
        height="50px"
        className="text-lg font-medium"
      >
        Realizar Pago
      </Button>
    </aside>
  );
};

export default OrderSummary;
