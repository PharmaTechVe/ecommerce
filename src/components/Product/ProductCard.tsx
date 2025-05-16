'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ExtendedProduct } from '@/lib/types/ExtendedProduct';
import CardButton from '../CardButton';
import Badge from '../Badge';

type Props = {
  product: ExtendedProduct;
};

export default function ProductCard({ product }: Props) {
  const stock = product.stock ?? 0;
  if (stock < 0) return null;

  const name = `${product.product.name} ${product.presentation.name}`;
  const imageUrl = product.product.images?.[0]?.url || '/placeholder.svg';
  const price = product.price;
  const now = new Date();

  const promosArray = Array.isArray(product.promo)
    ? product.promo
    : product.promo
      ? [product.promo]
      : [];

  const activePromos = promosArray.filter((promo) => {
    const start = new Date(promo.startAt);
    const end = new Date(promo.expiredAt);
    return start <= now && now < end;
  });

  const totalDiscount = activePromos.reduce(
    (sum, promo) => sum + (promo.discount || 0),
    0,
  );
  const hasDiscount = totalDiscount > 0;
  const finalPrice = hasDiscount ? price * (1 - totalDiscount / 100) : price;

  const firstCategory = product.product.categories?.[0];
  const href = `/product/${product.product.id}/presentation/${product.presentation.id}`;

  return (
    <div className="relative flex h-[400px] w-[260px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {firstCategory && (
        <div className="absolute right-3 top-3 z-10">
          <Badge variant="filled" color="tertiary" size="small">
            <span className="px-2 text-xs">{firstCategory.name}</span>
          </Badge>
        </div>
      )}

      <Link
        href={href}
        className="flex h-[160px] items-center justify-center pt-[10%]"
      >
        <Image
          src={imageUrl}
          alt={name}
          width={120}
          height={120}
          className="object-contain"
        />
      </Link>

      <div className="flex h-full flex-col justify-between px-4 py-2">
        <div className="flex flex-col gap-2">
          <Link href={href}>
            <h3 className="mt-[10%] line-clamp-2 min-h-[48px] text-left text-base font-medium text-gray-900">
              {name}
            </h3>
          </Link>
          <p className="text-left text-lg text-gray-500">
            Existencias: {stock}
          </p>
        </div>

        <div className="flex items-center justify-between gap-x-2 pb-[10%] pr-[10%] pt-1">
          <div className="flex flex-col items-start">
            {hasDiscount ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 line-through">
                    ${price.toFixed(2)}
                  </span>
                  <Badge
                    variant="filled"
                    color="warning"
                    size="small"
                    borderRadius="square"
                  >
                    <span style={{ color: '#000' }}>-{totalDiscount}%</span>
                  </Badge>
                </div>
                <span className="text-xl font-medium text-gray-900">
                  ${finalPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-medium text-gray-900">
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="max-w-[100px]">
            <CardButton
              product={{
                productPresentationId: product.id,
                name: product.product.name,
                price,
                discount: hasDiscount ? totalDiscount : undefined,
                image: imageUrl,
                stock,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
