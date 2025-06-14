'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Input from '@/components/Input/Input';
import { Colors } from '@/styles/styles';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/sdkConfig';
import { formatPrice } from '@/lib/utils/helpers/priceFormatter';
import useDollarRate from '@/hooks/useDollarRate';

interface OrderSummaryProps {
  hideCoupon?: boolean;
  couponCode: string;
  setCouponCode: (value: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  hideCoupon,
  couponCode,
  setCouponCode,
}) => {
  const { cartItems } = useCart();
  const { token } = useAuth();
  const [couponError, setCouponError] = React.useState<string>('');
  const [couponSuccess, setCouponSuccess] = React.useState(false);
  const [couponDiscount, setCouponDiscount] = React.useState<number>(0);
  const { dollarRate, loading } = useDollarRate();

  useEffect(() => {
    if (!hideCoupon) {
      setCouponCode('');
      setCouponDiscount(0);
      setCouponError('');
      setCouponSuccess(false);
    }
  }, [hideCoupon, setCouponCode]);

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
      setCouponDiscount(0);
      setCouponSuccess(false);
      return;
    }

    try {
      const coupon = await api.coupon.getByCode(couponCode.trim(), token);
      const { discount, minPurchase, expirationDate } = coupon;

      if (subtotal < minPurchase) {
        setCouponError(`Compra mínima de $${minPurchase.toFixed(2)}`);
        setCouponDiscount(0);
        setCouponSuccess(false);
        return;
      }

      if (new Date(expirationDate) < new Date()) {
        setCouponError('Cupón expirado');
        setCouponDiscount(0);
        setCouponSuccess(false);
        return;
      }

      const newDiscount = (subtotal - itemDiscount) * (discount / 100);
      setCouponDiscount(newDiscount);
      setCouponError('');
      setCouponSuccess(true);
    } catch {
      setCouponError('Cupón inválido');
      setCouponDiscount(0);
      setCouponSuccess(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
    setCouponError('');
    setCouponSuccess(false);
    setCouponDiscount(0);
  };

  const total = subtotal - itemDiscount - couponDiscount;

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
              onChange={handleCodeChange}
              borderSize="1px"
              borderColor={Colors.stroke}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={couponSuccess}
              className={`h-[37px] w-[126px] rounded-md px-7 py-2 text-[16px] text-white ${
                couponSuccess
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-[#1C2143] hover:opacity-60'
              }`}
            >
              Aplicar
            </button>
          </div>
          {couponError && (
            <p className="mt-1 text-sm text-red-600">{couponError}</p>
          )}
          {couponSuccess && (
            <p className="mt-1 text-sm text-green-600">
              Cupón aplicado con éxito
            </p>
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
                  ${formatPrice(discountedPrice)} x {item.quantity}
                </p>
              </div>
              <div className="text-right text-sm">
                {item.discount ? (
                  <>
                    <p className="text-[16px] text-[#2ECC71]">
                      ${formatPrice(discountedPrice * item.quantity)}
                    </p>
                    <p className="text-xs text-[#666666] line-through">
                      ${formatPrice(item.price * item.quantity)}
                    </p>
                  </>
                ) : (
                  <p className="text-[16px] text-[#393938]">
                    ${formatPrice(item.price * item.quantity)}
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
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[#2ECC71]">
          <span>Descuento</span>
          <span>${formatPrice(itemDiscount)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-[#2ECC71]">
            <span>Descuento Cupón</span>
            <span>${formatPrice(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 text-[24px] font-semibold leading-[36px] text-[#393938]">
          <span>Total</span>
          <span>${formatPrice(total)}</span>
        </div>
        {!loading && (
          <div className="flex justify-between pt-2 text-[20px] leading-[36px] text-[#393938]">
            <span>Total Bs</span>
            <span>Bs. {formatPrice(total * dollarRate!)}</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default OrderSummary;
