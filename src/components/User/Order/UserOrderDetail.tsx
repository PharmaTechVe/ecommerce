'use client';

import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/outline';
import CheckButton from '@/components/CheckButton';
import {
  OrderDetailResponse,
  OrderDetailProductPresentationResponse,
} from '@pharmatech/sdk';
import Button from '@/components/Button';

interface OrderDetailProps {
  orderNumber: string;
  products: OrderDetailResponse[];
  subtotal: number;
  total: number;
}

export default function UserOrderDetail({
  orderNumber,
  products,
  subtotal,
  total,
}: OrderDetailProps) {
  const now = new Date();

  const totalDiscount = products.reduce((acc, item) => {
    const presentation: OrderDetailProductPresentationResponse =
      item.productPresentation;
    const promo = presentation.promo;
    const basePrice = presentation.price;
    const quantity = item.quantity;

    const isPromoActive =
      promo &&
      new Date(promo.startAt) <= now &&
      now < new Date(promo.expiredAt);

    if (isPromoActive) {
      const discountedPrice = basePrice * (1 - promo.discount / 100);
      const discountAmount = (basePrice - discountedPrice) * quantity;
      return acc + discountAmount;
    }

    return acc;
  }, 0);

  return (
    <div className="mx-auto w-full max-w-[942px] bg-white px-2 py-6 sm:px-6">
      {/* Header */}
      <div className="space-around mb-4 flex items-center justify-between">
        <h2 className="font-medium text-gray-500">
          Pedido #{orderNumber.slice(0, 8)}
        </h2>
        <Link href={`/order/${orderNumber}`}>
          <Button
            className="rounded-md px-4 py-2 text-sm font-medium text-[#1C2143]"
            width="auto"
            height="auto"
          >
            Tracking
          </Button>
        </Link>
      </div>

      <div className="my-4 border-t border-gray-200" />

      {/* Order Summary*/}
      <div className="max-h-[460px] space-y-6 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:max-h-none sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {products.map((item, idx) => {
          const presentation: OrderDetailProductPresentationResponse =
            item.productPresentation;
          const product = presentation.product;
          const basePrice = presentation.price;
          const quantity = item.quantity;
          const promo = presentation.promo;

          const isPromoActive =
            promo &&
            new Date(promo.startAt) <= now &&
            now < new Date(promo.expiredAt);

          const discountedPrice = isPromoActive
            ? basePrice * (1 - promo.discount / 100)
            : basePrice;

          return (
            <div
              key={`${presentation.id}-${idx}`}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              {/* MOBILE */}
              <div className="flex w-full flex-col sm:hidden">
                <div className="flex gap-2">
                  <div className="h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={product.images?.[0]?.url ?? '/placeholder.png'}
                      alt={product.name}
                      width={88}
                      height={88}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex w-full flex-col">
                    <div className="flex justify-between">
                      <h3 className="truncate text-sm font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        Cantidad: {quantity}
                      </span>
                    </div>

                    <p className="max-w-[13ch] truncate text-xs text-gray-500">
                      {product.description}
                    </p>

                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex flex-col">
                        {isPromoActive && (
                          <span className="text-xs text-gray-400 line-through">
                            ${(basePrice * quantity).toFixed(2)}
                          </span>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          ${(discountedPrice * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1">
                      <Link
                        href={{
                          pathname: `/product/${product.id}/presentation/${presentation.presentation.id}`,
                          query: { productPresentationId: presentation.id },
                        }}
                        className="flex items-center text-xs text-[#1C2143]"
                      >
                        <StarIcon className="mr-1 h-4 w-4" />
                        <span>Ir al producto</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESKTOP */}
              <div className="hidden w-full sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <CheckButton
                    checked
                    onChange={() => {}}
                    text=""
                    variant="tertiary"
                  />
                  <div className="h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={product.images?.[0]?.url ?? '/placeholder.png'}
                      alt={product.name}
                      width={88}
                      height={88}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex w-1/2 flex-col">
                  <h3 className="text-sm font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="h-5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500">
                    {product.description?.substring(0, 50)}
                    {product.description && product.description.length > 50 && (
                      <span className="text-xs text-gray-500">...</span>
                    )}
                  </p>
                  <Link
                    href={{
                      pathname: `/product/${product.id}/presentation/${presentation.presentation.id}`,
                      query: { productPresentationId: presentation.id },
                    }}
                    className="mt-1 flex w-fit items-center text-xs text-[#1C2143]"
                  >
                    <StarIcon className="mr-1 h-4 w-4" />
                    <span>Ir al producto</span>
                  </Link>
                </div>

                <div className="flex items-center gap-10">
                  <div className="text-sm text-gray-500">{quantity}</div>
                  <div className="flex w-28 flex-col items-end text-right font-medium text-gray-900">
                    {isPromoActive && (
                      <span className="text-xs text-gray-400 line-through">
                        ${(basePrice * quantity).toFixed(2)}
                      </span>
                    )}
                    <span>${(discountedPrice * quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOTALS */}
      <div className="mt-8 w-full rounded-md bg-[#F1F5FD] p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-gray-700">
              Subtotal{' '}
              <span className="text-gray-500">
                ({products.length} productos)
              </span>
            </div>
            <div className="text-gray-700">${subtotal.toFixed(2)}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[#2ECC71]">Descuentos</div>
            <div className="text-[#2ECC71]">-${totalDiscount.toFixed(2)}</div>
          </div>

          <div className="my-2 border-t border-gray-300" />

          <div className="flex items-center justify-between font-medium">
            <div className="text-gray-900">TOTAL</div>
            <div className="text-gray-900">${total.toFixed(2)}</div>
          </div>

          <div className="text-right text-xs text-gray-500">
            El total ya incluye los descuentos aplicados.
          </div>
        </div>
      </div>
    </div>
  );
}
