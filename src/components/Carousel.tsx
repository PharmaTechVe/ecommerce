'use client';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Image, { type StaticImageData } from 'next/image';
import { Colors } from '../styles/styles';

export type ImageType = string | StaticImageData;

type Slide = {
  id: number;
  imageUrl: string | ImageType;
};
type Props = {
  slides: Slide[];
};

export default function Carousel({ slides }: Props) {
  const [current, setCurrent] = useState(0);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  // Avanza automáticamente cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div
      className="relative mx-auto h-[180px] w-full max-w-[95vw] overflow-visible rounded-xl md:h-[316px] md:max-w-6xl"
      style={{ backgroundColor: Colors.primary }}
    >
      <button
        onClick={prevSlide}
        className="absolute left-[-20px] top-1/2 z-10 flex h-[60px] w-[60px] -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-white md:h-[86px] md:w-[86px] md:border-[10px]"
        style={{ backgroundColor: Colors.semanticInfo }}
        aria-label="Scroll left"
      >
        <ChevronLeftIcon className="h-6 w-6 text-white md:h-14 md:w-7" />
      </button>
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={`Slide ${slide.id}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <button
        onClick={nextSlide}
        className="absolute right-[-20px] top-1/2 z-10 flex h-[60px] w-[60px] -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-white md:right-[-35px] md:h-[86px] md:w-[86px] md:border-[10px]"
        style={{ backgroundColor: Colors.semanticInfo }}
        aria-label="Scroll right"
      >
        <ChevronRightIcon className="h-6 w-6 text-white md:h-14 md:w-7" />
      </button>
      <div className="absolute bottom-4 left-20 mb-5 flex gap-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? 'w-6 bg-white' : 'w-2 bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
