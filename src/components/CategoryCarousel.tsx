// components/CategoryCarousel.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import type { Category } from '@pharmatech/sdk';
import { Colors } from '@/styles/styles';

interface CategoryCarouselProps {
  categories: Category[];
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
            onClick={() => {
              // Empuja la URL con ?category=<nombre>
              router.push(`/search?category=${encodeURIComponent(cat.name)}`);
            }}
          >
            <div className="rounded-lg border p-4 text-center shadow-sm hover:bg-gray-100">
              {cat.name}
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
