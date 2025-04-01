'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export type Slide = {
  id: number;
  imageUrl: string;
};

type CarouselProps = {
  slides: Slide[];
};

const SWIPE_THRESHOLD = 50;

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  if (slides.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;

    if (distance > SWIPE_THRESHOLD) {
      handleNext();
    } else if (distance < -SWIPE_THRESHOLD) {
      handlePrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Thumbnails: solo en desktop (md+) */}
      <div className="hidden flex-col gap-2 md:flex">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`cursor-pointer overflow-hidden rounded-md border-2 ${
              index === currentIndex ? 'border-primary' : 'border-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              src={slide.imageUrl}
              alt={`Thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Imagen principal (mobile y desktop) */}
      <div
        className="relative ml-0 mt-2 h-[250px] w-full rounded-md sm:h-[350px] md:ml-4 md:mt-0 md:h-[500px] md:border md:border-gray-300"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={slides[currentIndex].imageUrl}
          alt={`Main Image ${currentIndex + 1}`}
          fill
          className="rounded-md object-cover"
        />
      </div>

      {/* Indicadores (solo en mobile), para que se sepa en qué slide estás */}
      <div className="mt-2 flex items-center justify-center space-x-2 md:hidden">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? 'bg-gray-800' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
