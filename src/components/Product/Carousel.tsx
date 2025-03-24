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

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (slides.length === 0) return null;

  return (
    <div className="flex">
      {/* Columna de miniaturas a la izquierda */}
      <div className="flex flex-col gap-2">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`cursor-pointer overflow-hidden rounded-md border-2 ${
              index === currentIndex ? 'border-primary' : 'border'
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
      {/* Imagen principal */}
      <div className="relative ml-4 h-[500px] w-full rounded-md border">
        <Image
          src={slides[currentIndex].imageUrl}
          alt={`Main Image ${currentIndex + 1}`}
          fill
          className="rounded-md object-cover"
        />
      </div>
    </div>
  );
};

export default Carousel;
