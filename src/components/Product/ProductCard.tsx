'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ProductPresentation } from '@pharmatech/sdk';
import CardButton from '../CardButton';

type Props = {
  product: ProductPresentation;
};

export default function ProductCard({ product }: Props) {
  const name = `${product.product.name} ${product.presentation.name}`;
  const image = product.product.images?.[0]?.url || '/placeholder.svg';
  const stock = product.stock ?? 0;
  const price = product.price;
  const href = `/product/${product.product.id}/presentation/${product.presentation.id}`;

  return (
    <div className="flex h-[400px] w-[260px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Link href={href} className="flex h-[160px] items-center justify-center">
        <Image
          src={image}
          alt={name}
          width={120}
          height={120}
          className="object-contain"
        />
      </Link>

      {/* Contenido */}
      <div className="flex h-full flex-col justify-between px-4 py-2">
        <div className="flex flex-col gap-2">
          <Link href={href}>
            <h3 className="mt-[10%] line-clamp-2 min-h-[48px] text-left text-base font-medium text-gray-900">
              {name}
            </h3>
          </Link>

          <p className="text-left text-lg text-gray-500">Stock: {stock}</p>
        </div>

        <div className="flex items-center justify-between gap-x-2 pb-[10%] pr-[10%] pt-1">
          <span className="text-xl font-medium text-gray-900">
            ${price.toFixed(2)}
          </span>

          <div className="max-w-[100px]">
            <CardButton
              product={{
                productPresentationId: product.id,
                name: product.product.name,
                price,
                discount: undefined,
                image,
                stock,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
