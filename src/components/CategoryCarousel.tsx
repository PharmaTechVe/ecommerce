// components/CategoryCarousel.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import type { Category } from '@pharmatech/sdk';
import { Colors } from '@/styles/styles';

interface CategoryCarouselProps {
  categories: (Category & { imageUrl?: string })[]; // asumimos imageUrl en el endpoint
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
    <div className="flex items-center">
      <button onClick={() => scroll('left')} className="p-2">
        <ChevronLeftIcon className="h-6 w-6" style={{ color: Colors.neuter }} />
      </button>

      <div
        ref={sliderRef}
        className="hide-scrollbar flex gap-4 overflow-x-auto px-2"
      >
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="flex-shrink-0 cursor-pointer"
            style={{
              minWidth: `calc((100% - ${visibleCount - 1}rem) / ${visibleCount})`,
            }}
            onClick={() =>
              router.push(`/search?category=${encodeURIComponent(cat.name)}`)
            }
          >
            <div className="overflow-hidden rounded-lg shadow-sm hover:opacity-90">
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  width={240}
                  height={120}
                  className="h-32 w-full object-cover"
                />
              ) : (
                <div className="flex h-32 w-full items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div className="p-2 text-center font-medium">{cat.name}</div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => scroll('right')} className="p-2">
        <ChevronRightIcon
          className="h-6 w-6"
          style={{ color: Colors.neuter }}
        />
      </button>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
