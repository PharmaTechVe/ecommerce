'use client';

import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/outline';
import CheckButton from '@/components/CheckButton';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  checked: boolean;
}

interface OrderDetailProps {
  orderNumber: string;
  products: Product[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export default function OrderDetail({
  orderNumber,
  products,
  subtotal,
  discount,
  tax,
  total,
}: OrderDetailProps) {
  return (
    <div className="mx-auto w-full max-w-[954px] bg-white p-6 px-4 sm:px-6">
      {/* Número de pedido */}
      <div className="mb-4">
        <h2 className="font-medium text-gray-500">Pedido #{orderNumber}</h2>
      </div>

      <div className="my-4 border-t border-gray-200" />

      {/* Lista de productos */}
      <div className="space-y-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            {/* MOBILE */}
            <div className="flex w-full flex-col sm:hidden">
              <div className="flex items-start gap-2">
                <CheckButton
                  checked={product.checked}
                  onChange={() => {}}
                  text=""
                  variant="tertiary"
                />

                <div className="flex w-full items-start gap-2">
                  {/* Imagen */}
                  <div className="h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={
                        product.image || '/placeholder.svg?height=88&width=88'
                      }
                      alt={product.name}
                      width={88}
                      height={88}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info al lado */}
                  <div className="flex w-full min-w-0 flex-col justify-start">
                    <h3 className="overflow-hidden truncate whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </h3>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.quantity}
                      </span>
                    </div>

                    <div className="mt-2">
                      <button className="flex items-center text-sm text-[#1C2143]">
                        <StarIcon className="mr-1 h-4 w-4" />
                        <span>Ir al producto</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden w-full sm:flex sm:items-center sm:justify-between">
              {/* Check + Imagen */}
              <div className="flex items-center gap-2">
                <CheckButton
                  checked={true}
                  onChange={() => {}}
                  text=""
                  variant="tertiary"
                />
                <div className="h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <Image
                    src={product.image || '/placeholder.svg?height=88&width=88'}
                    alt={product.name}
                    width={88}
                    height={88}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Info texto */}
              <div className="flex w-1/2 flex-col">
                <h3 className="text-sm font-medium text-gray-900">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500">{product.description}</p>
              </div>

              {/* Cantidad + Precio */}
              <div className="flex items-center gap-10">
                <div className="text-sm text-gray-500">{product.quantity}</div>
                <div className="w-20 text-right font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
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

          <div className="flex items-center justify-between">
            <div className="text-gray-700">IVA</div>
            <div className="text-gray-700">${tax.toFixed(2)}</div>
          </div>

          <div className="my-2 border-t border-gray-300" />

          <div className="flex items-center justify-between font-medium">
            <div className="text-gray-900">TOTAL</div>
            <div className="text-gray-900">${total.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
