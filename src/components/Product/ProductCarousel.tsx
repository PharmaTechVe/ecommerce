'use client';

import { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import ProductCard from './ProductCard';
import type { ExtendedProduct } from '@/lib/types/ExtendedProduct';

interface ProductSliderProps {
  title?: string;
  products: ExtendedProduct[];
}

export default function ProductSlider({ title, products }: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 276;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative w-full px-2 sm:px-4">
      {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}

      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
        aria-label="Scroll left"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
      </button>

      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth py-2 scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: '1rem',
          scrollPaddingRight: '1rem',
        }}
      >
        {products
          .filter((p) => p.stock > 0)
          .map((p) => (
            <div
              key={p.id}
              className="flex-shrink-0 snap-start"
              style={{
                width: '96vw',
                maxWidth: '260px',
              }}
            >
              <ProductCard product={p} />
            </div>
          ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
        aria-label="Scroll right"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-600" />
      </button>
    </section>
  );
}
