'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { OrderDetailedResponse } from '@pharmatech/sdk';

interface ProductOrderSummaryProps {
  order: OrderDetailedResponse;
}

const ProductOrderSummary: React.FC<ProductOrderSummaryProps> = ({ order }) => {
  // Compute items, subtotal and discounts
  const { items, subtotal, itemDiscount, total } = useMemo(() => {
    const items = order.details.map((detail) => {
      const price = detail.productPresentation.price;
      const qty = detail.quantity;
      const promo = detail.productPresentation.promo?.discount || 0;
      const discountedUnit = promo > 0 ? price * (1 - promo / 100) : price;
      const lineSubtotal = discountedUnit * qty;
      const lineDiscount = promo > 0 ? (price - discountedUnit) * qty : 0;
      return {
        detail,
        discountedUnit,
        qty,
        price,
        promo,
        lineSubtotal,
        lineDiscount,
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const itemDiscount = items.reduce((sum, i) => sum + i.lineDiscount, 0);
    const total = subtotal - itemDiscount;

    return { items, subtotal, itemDiscount, total };
  }, [order.details]);

  return (
    <aside className="w-full max-w-[412px] space-y-6 p-6 font-['Poppins']">
      <p className="mb-2 text-[16px] font-medium text-[#393938]">
        Resumen del pedido
      </p>

      <div className="custom-scroll max-h-64 space-y-4 overflow-y-auto pr-1">
        {items.map(
          (
            { detail, discountedUnit, qty, price, promo, lineSubtotal },
            index,
          ) => (
            <div key={detail.id ?? index} className="flex items-start gap-4">
              <div className="relative h-24 w-24">
                <Image
                  src={
                    detail.productPresentation.product.images?.[0]?.url ?? ''
                  }
                  alt={detail.productPresentation.product.name}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-[14px] text-[#393938]">
                  {detail.productPresentation.product.name}
                </p>
                <p className="text-[12px] text-[#6E6D6C]">
                  ${discountedUnit.toFixed(2)} x {qty}
                </p>
              </div>
              <div className="text-right text-sm">
                {promo > 0 ? (
                  <React.Fragment>
                    <p className="text-[16px] text-[#2ECC71]">
                      ${lineSubtotal.toFixed(2)}
                    </p>
                    <p className="text-xs text-[#666666] line-through">
                      ${(price * qty).toFixed(2)}
                    </p>
                  </React.Fragment>
                ) : (
                  <p className="text-[16px] text-[#393938]">
                    ${lineSubtotal.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ),
        )}
      </div>

      <div className="space-y-2 text-sm text-[#393938]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {itemDiscount > 0 && (
          <div className="flex justify-between text-[#2ECC71]">
            <span>Descuento</span>
            <span>-${itemDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 text-[24px] font-semibold leading-[36px] text-[#393938]">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  );
};

export default ProductOrderSummary;
