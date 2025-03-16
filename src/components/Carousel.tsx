'use client';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { Colors } from '../styles/styles';
type Slide = {
  id: number;
  imageUrl: string;
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
  return (
    <div
      className="relative mx-auto h-[316px] w-[1200px] max-w-6xl overflow-visible rounded-xl"
      style={{ backgroundColor: Colors.primary }}
    >
      <button
        onClick={prevSlide}
        className="absolute left-[-35px] top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border-[10px] border-white"
        style={{
          width: '86px',
          height: '86px',
          backgroundColor: Colors.semanticInfo,
        }}
      >
        <ChevronLeftIcon className="h-14 w-7 text-white" />
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
        className="absolute right-[-35px] top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border-[10px] border-white"
        style={{
          width: '86px',
          height: '86px',
          backgroundColor: Colors.semanticInfo,
        }}
      >
        <ChevronRightIcon className="h-14 w-7 text-white" />
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
