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
  discount: number;
  total: number;
}

export default function UserOrderDetail({
  orderNumber,
  products,
  subtotal,
  discount,
  total,
}: OrderDetailProps) {
  return (
    <div className="mx-auto w-full max-w-[954px] bg-white px-2 py-6 sm:px-6">
      {/* Encabezado */}

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

      {/* Lista con scroll en mobile */}
      <div className="max-h-[460px] space-y-6 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:max-h-none sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {products.map((item, idx) => {
          const presentation: OrderDetailProductPresentationResponse =
            item.productPresentation;
          const product = presentation.product;

          const originalPrice = presentation.promo
            ? presentation.price * item.quantity
            : null;

          return (
            <div
              key={`${presentation.id}-${idx}`}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              {/* MOBILE */}
              <div className="flex w-full flex-col sm:hidden">
                <div className="flex gap-2">
                  {/* Imagen */}
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
                    {/* Nombre y cantidad */}
                    <div className="flex justify-between">
                      <h3 className="truncate text-sm font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        Cantidad: {item.quantity}
                      </span>
                    </div>

                    {/* Descripción */}
                    <p className="max-w-[13ch] truncate text-xs text-gray-500">
                      {product.description}
                    </p>

                    {/* Precios */}
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex flex-col">
                        {originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Ir al producto */}
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
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500">
                    {product.description}
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
                  <div className="text-sm text-gray-500">{item.quantity}</div>
                  <div className="flex w-28 flex-col items-end text-right font-medium text-gray-900">
                    {originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span>${item.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen del pedido */}
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
            <div className="text-[#2ECC71]">-${discount.toFixed(2)}</div>
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
