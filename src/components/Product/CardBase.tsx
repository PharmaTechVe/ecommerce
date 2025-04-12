'use client';
import type React from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { Colors, CardDimensions, imageSizes } from '@/styles/styles';

export type ImageType = string | StaticImageData;

interface CardBaseProps {
  variant?: 'regular' | 'minimal' | 'responsive';
  showRibbon?: boolean;
  imageSrc?: string | ImageType;
  ribbonText?: string;
  label?: string;
  imageLink?:
    | string
    | {
        pathname: string;
        query: Record<string, string | string[]>;
      };
  children: React.ReactNode;
}

const CardBase: React.FC<CardBaseProps> = ({
  variant = 'regular',
  showRibbon = false,
  imageSrc,
  ribbonText,
  label,
  imageLink,
  children,
}) => {
  const cardSize = CardDimensions.cardSizes[variant];
  const ribbonDim = CardDimensions.ribbonDimensions[variant];
  const currentImageSize = imageSizes[variant];

  return (
    <div
      className={`relative ${cardSize} box-border rounded-[16px] border bg-white`}
    >
      {/* Ribbon (se muestra solo en variantes que no sean 'responsive') */}
      {variant !== 'responsive' && showRibbon && ribbonText && (
        <div
          className="absolute left-[-1%] top-[-1%] z-10 overflow-hidden"
          style={{
            width: ribbonDim.width,
            height: ribbonDim.height,
          }}
        >
          <svg
            width={ribbonDim.svgWidth}
            height={ribbonDim.svgHeight}
            viewBox="0 0 81 76"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 0.5H76L81 6.5V20L76 39.5L71 49.5L62 59.5L53 66L43.5 70.5L25.5 76H16L7 73.5L1 70.5V23.5V14L4 6.5L7 3L11 0.5H16Z"
              fill={Colors.ribbon}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
            <span className="whitespace-pre-wrap text-center">
              {ribbonText.split(' ').join('\n')}
            </span>
          </div>
        </div>
      )}

      {/* Etiqueta */}
      {label && (
        <div
          className="absolute right-4 top-4 rounded-full px-3 py-1 text-sm"
          style={{
            backgroundColor: Colors.secondaryLight,
            color: Colors.textWhite,
          }}
        >
          {label}
        </div>
      )}

      {/* Contenedor de la imagen */}
      <div
        className={`relative mt-[80px] flex items-center justify-center bg-white`}
      >
        {imageSrc ? (
          imageLink ? (
            // Envolvemos la imagen en un Link para que sea clickeable
            <Link href={imageLink}>
              <div className="relative flex items-center justify-center">
                <Image
                  src={imageSrc}
                  alt="Product Image"
                  width={currentImageSize.width}
                  height={currentImageSize.height}
                  className="rounded-md object-contain"
                />
              </div>
            </Link>
          ) : (
            <div className="relative flex items-center justify-center">
              <Image
                src={imageSrc}
                alt="Product Image"
                width={currentImageSize.width}
                height={currentImageSize.height}
                className="rounded-md object-contain"
              />
            </div>
          )
        ) : (
          <span style={{ color: Colors.textMain }}>Sin imagen</span>
        )}
      </div>

      {/* Contenido dinámico */}
      {children}
    </div>
  );
};

export default CardBase;
