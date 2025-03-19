'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import type { ImageType } from '@/components/Product/CardBase';
import ProductCard from '@/components/Product/ProductCard';
import { Colors } from '@/styles/styles';

export type Product = {
  id: number;
  productName: string;
  stock: number;
  currentPrice: number;
  lastPrice?: number;
  discountPercentage?: number;
  ribbonText?: string;
  imageSrc: ImageType;
  label?: string;
};

export type ProductSliderProps = {
  title?: string;
  products: Product[];
  carouselType?: 'regular' | 'large';
  itemsPerSection?: number;
};

export default function ProductSlider({
  title,
  products,
  carouselType = 'regular',
  itemsPerSection = 1,
}: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<'responsive' | 'minimal' | 'regular'>(
    'regular',
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 800) {
        setVariant('responsive');
      } else if (width < 1024) {
        setVariant('minimal');
      } else {
        setVariant('regular');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [carouselType]);

  const effectiveItemsPerSection =
    variant === 'responsive' ? 1 : variant === 'minimal' ? 2 : itemsPerSection;

  const cardVariant =
    itemsPerSection === 4 && variant === 'regular' ? 'minimal' : variant;

  const gapValuePx = variant === 'responsive' ? 6 : 10;
  const gapBetweenClass = variant === 'responsive' ? 'gap-2' : 'gap-4';

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const containerWidth = sliderRef.current.clientWidth;
    const totalGap = (effectiveItemsPerSection - 1) * gapValuePx;
    const itemWidth = (containerWidth - totalGap) / effectiveItemsPerSection;
    const scrollValue = direction === 'left' ? -itemWidth : itemWidth;
    sliderRef.current.scrollBy({ left: scrollValue, behavior: 'smooth' });
  };

  return (
    <section className="relative gap-2">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}

      <div className="relative w-full">
        {/* Flecha izquierda */}
        <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
          <button
            onClick={() => scroll('left')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon
              className="h-6 w-6"
              style={{ color: Colors.neuter }}
            />
          </button>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className={`hide-scrollbar flex items-center overflow-y-hidden ${gapBetweenClass}`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{
                width: `calc((100% - ${(effectiveItemsPerSection - 1) * gapValuePx}px) / ${effectiveItemsPerSection})`,
              }}
            >
              <ProductCard {...product} variant={cardVariant} />
            </div>
          ))}
        </div>

        {/* Flecha derecha */}
        <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
          <button
            onClick={() => scroll('right')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
            aria-label="Scroll right"
          >
            <ChevronRightIcon
              className="h-6 w-6"
              style={{ color: Colors.neuter }}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
