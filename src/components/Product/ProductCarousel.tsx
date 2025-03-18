'use client';
import { ReactNode, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Colors } from '@/styles/styles';
import { useWindowWidth } from '@/lib/hooks/useProductCarousel';

interface ProductCarouselProps {
  children: ReactNode[];
  isLargeCarousel?: boolean;
}

export default function ProductCarousel({
  children,
  isLargeCarousel = false,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const width = useWindowWidth();

  // Determinar la variante según el ancho de pantalla
  let variant: 'responsive' | 'minimum' | 'regular' = 'regular';
  if (width < 640) {
    variant = 'responsive'; // Móvil
  } else if (width >= 640 && width < 1024) {
    variant = 'minimum'; // Pantalla mediana
  } else {
    variant = 'regular'; // Pantalla grande
  }

  // Definir cuántas tarjetas mostrar según variante y tamaño del carrusel
  let visibleCards = 1;
  if (variant === 'responsive') {
    visibleCards = 1;
  } else if (variant === 'minimum') {
    visibleCards = isLargeCarousel ? 2 : 3;
  } else if (variant === 'regular') {
    visibleCards = isLargeCarousel ? 3 : 4;
  }

  // Cálculo dinámico del ancho de cada tarjeta
  const containerPadding = 48; // px padding horizontal
  const gap = 48; // px gap entre tarjetas
  const totalGapWidth = gap * (visibleCards - 1);
  const availableWidth = width - containerPadding * 2 - totalGapWidth;
  const cardWidth = Math.floor(availableWidth / visibleCards);
  const totalScroll = cardWidth + gap;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -totalScroll, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: totalScroll, behavior: 'smooth' });
  };

  return (
    <div className="relative my-8 w-full overflow-hidden px-6">
      {/* Botón Izquierda */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 items-center justify-center md:p-3"
      >
        <ChevronLeftIcon className="h-6 w-6" style={{ color: Colors.stroke }} />
      </button>

      {/* Contenedor scrollable */}
      <div
        ref={scrollRef}
        className="flex gap-12 overflow-x-auto scrollbar-hide"
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: `${cardWidth}px` }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Botón Derecha */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 items-center justify-center md:p-3"
      >
        <ChevronRightIcon
          className="h-6 w-6"
          style={{ color: Colors.stroke }}
        />
      </button>
    </div>
  );
}
