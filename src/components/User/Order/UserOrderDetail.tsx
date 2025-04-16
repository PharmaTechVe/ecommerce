'use client';

import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/outline';

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
    <div className="mx-auto w-[954px] max-w-full overflow-auto bg-white p-6">
      {/* Order Number */}
      <div className="mb-4">
        <h2 className="font-medium text-gray-500">Pedido #{orderNumber}</h2>
      </div>

      <div className="my-4 border-t border-gray-200"></div>

      {/* Lista de productos */}
      <div className="space-y-6">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-100 text-teal-500">
                {product.checked && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            </div>

            {/* Imagen del producto */}
            <div className="h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <Image
                src={product.image || '/placeholder.svg?height=88&width=88'}
                alt={product.name}
                width={88}
                height={88}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Detalles */}
            <div className="flex-grow">
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.description}</p>
              <button className="mt-1 flex items-center text-sm text-[#1C2143]">
                <StarIcon className="mr-1 h-4 w-4" />
                <span>Ir al producto</span>
              </button>
            </div>

            {/* Cantidad */}
            <div className="w-8 flex-shrink-0 text-center text-gray-500">
              {product.quantity}
            </div>

            {/* Precio */}
            <div className="w-20 flex-shrink-0 text-right font-medium text-gray-900">
              ${product.price.toFixed(2)}
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

          <div className="my-2 border-t border-gray-300"></div>

          <div className="flex items-center justify-between font-medium">
            <div className="text-gray-900">TOTAL</div>
            <div className="text-gray-900">${total.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
