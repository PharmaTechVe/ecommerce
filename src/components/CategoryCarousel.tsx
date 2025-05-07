'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import type { Category } from '@pharmatech/sdk';

interface CategoryCarouselProps {
  categories: (Category & { id: string; imageUrl?: string })[];
}

export default function CategoryCarousel({
  categories,
}: CategoryCarouselProps) {
  const router = useRouter();

  const sliderRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisibleCount(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const step = sliderRef.current.clientWidth / visibleCount;
    sliderRef.current.scrollBy({
      left: dir === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative flex items-center overflow-visible">
      {/* Flecha izquierda */}
      <button
        onClick={() => scroll('left')}
        className="absolute -left-10 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white"
      >
        <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
      </button>

      {/* Carrusel de categorías */}
      <div
        ref={sliderRef}
        className="scrollbar-none flex gap-6 overflow-x-auto px-12 py-4"
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              const params = new URLSearchParams();

              const q = '';
              if (q) params.set('query', q);
              params.set('categoryId', cat.id);
              router.push(`/search?${params.toString()}`);
            }}
            className="w-64 flex-shrink-0 rounded-xl border border-gray-200 bg-white p-4 shadow transition hover:shadow-lg"
          >
            {cat.imageUrl ? (
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                width={240}
                height={160}
                className="mx-auto h-40 w-full rounded-md object-cover"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded-md bg-gray-100">
                <span className="text-gray-500">{cat.name}</span>
              </div>
            )}
            <div className="mt-4 text-center">
              <span className="block text-lg font-medium text-gray-800">
                {cat.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Flecha derecha */}
      <button
        onClick={() => scroll('right')}
        className="absolute -right-10 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white"
      >
        <ChevronRightIcon className="h-6 w-6 text-gray-600" />
      </button>

      <style jsx>{`
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
