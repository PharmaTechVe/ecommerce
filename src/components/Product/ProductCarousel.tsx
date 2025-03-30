'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import type { ImageType } from '@/components/Product/CardBase';
import ProductCard from '@/components/Product/ProductCard';
import { Colors } from '@/styles/styles';

export type Product = {
  id: number;
  productId: string;
  presentationId: string;
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
};

export default function ProductSlider({
  title,
  products,
  carouselType = 'large',
}: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [visibleProducts, setVisibleProducts] = useState(3);
  const [variant, setVariant] = useState<'responsive' | 'minimal' | 'regular'>(
    'regular',
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVariant('responsive');
        setVisibleProducts(1);
      } else if (width < 1111) {
        setVariant('minimal');
        setVisibleProducts(2);
      } else if (width < 1900) {
        setVariant('regular');
        setVisibleProducts(3);
      } else {
        setVariant('regular');
        setVisibleProducts(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [carouselType]);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const containerWidth = sliderRef.current.clientWidth;
    const itemWidth = containerWidth / visibleProducts;
    const scrollValue = direction === 'left' ? -itemWidth : itemWidth;
    sliderRef.current.scrollBy({ left: scrollValue, behavior: 'smooth' });
  };

  // Para mobile se usa un margen y gap menor
  const marginLR = variant === 'responsive' ? '16px' : '56px';
  const gapBetween = variant === 'responsive' ? 'gap-2' : 'gap-4';
  // Define la altura de la card en mobile; ajusta este valor según tu diseño.
  const cardHeight = variant === 'responsive' ? '400px' : 'auto';

  return (
    <section className="relative mt-[-10%]">
      {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}

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

        {/* Carrusel: se fija la altura en mobile al valor de cardHeight */}
        <div
          ref={sliderRef}
          className={`hide-scrollbar mx-auto flex w-[90%] items-center overflow-x-auto overflow-y-hidden ${gapBetween}`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            marginLeft: marginLR,
            marginRight: marginLR,
            height: cardHeight,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{
                width: `calc(100% / ${visibleProducts} - 1rem)`,
                minWidth: `calc(100% / ${visibleProducts} - 1rem)`,
                maxWidth: `calc(100% / ${visibleProducts} - 1rem)`,
              }}
            >
              <ProductCard {...product} variant={variant} />
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
