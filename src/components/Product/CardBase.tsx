import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Colors } from '@/styles/styles';
import CartButton from '../CardButton';

export type ImageType = string | StaticImageData;

interface CardBaseProps {
  variant?: 'regular' | 'large' | 'compact' | 'responsive';
  showRibbon?: boolean;
  imageSrc?: ImageType;
  ribbonText?: string;
  label?: string;
  children: React.ReactNode;
}

const CardBase: React.FC<CardBaseProps> = ({
  variant = 'regular',
  showRibbon = false,
  imageSrc,
  ribbonText,
  label,
  children,
}) => {
  const cardDimensions = {
    regular: 'h-[610px] w-[351px]',
    large: 'h-[879.99px] w-[533px]',
    compact: 'h-[302px] w-[170px] sm:h-[274px]',
    responsive: 'h-[274px] w-[170px]',
  }[variant];

  const imageContainerStyles = {
    regular: 'h-[249px] w-[249px] p-[24px]',
    large: 'h-[389px] w-[389px]  mt-[110px]',
    compact: 'h-[100px] w-[100px] p-[20px] sm:h-[90px]',
    responsive: 'h-[90px] w-[90px] p-[12px] mt-[38px]',
  }[variant];

  const ribbonDimensions = {
    regular: {
      width: '97.73px',
      height: '97.2px',
      svgWidth: 99,
      svgHeight: 98,
    },
    large: { width: '140px', height: '140px', svgWidth: 140, svgHeight: 140 },
    compact: { width: '70px', height: '70px', svgWidth: 70, svgHeight: 70 },
    responsive: { width: '65px', height: '65px', svgWidth: 65, svgHeight: 65 },
  }[variant];

  return (
    <div
      className={`relative ${cardDimensions} rounded-lg bg-white p-6 shadow-lg`}
    >
      {/* Ribbon SVG */}
      {showRibbon && ribbonText && (
        <div
          className="absolute left-0 top-0 ml-[-1.2px] overflow-hidden"
          style={{
            width: ribbonDimensions.width,
            height: ribbonDimensions.height,
          }}
        >
          <svg
            width={ribbonDimensions.svgWidth}
            height={ribbonDimensions.svgHeight}
            viewBox="0 0 99 98"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.0679756 91.5485C8.43593 95.0826 17.4044 96.9579 26.4803 97.0712C65.5363 97.5842 97.6122 66.1679 98.128 26.9013C98.2536 17.7761 96.6247 8.7127 93.331 0.209198L1.28367 -0.99991L0.0679756 91.5485Z"
              fill={Colors.ribbon}
            />
          </svg>
          <div
            className={`absolute left-0 top-0 flex h-full w-full items-center justify-center ${
              variant === 'large'
                ? 'm-[-10%] text-[40px] font-black'
                : variant === 'responsive'
                  ? 'text-xs font-medium'
                  : 'text-sm font-bold'
            }`}
            style={{
              marginTop: variant === 'regular' ? '-5%' : '',
            }}
          >
            <span className="whitespace-pre-wrap text-center text-sm font-black text-white">
              {ribbonText.split(' ').join('\n')}
            </span>
          </div>
        </div>
      )}

      {/* Badge (Etiqueta de producto) */}
      {label && (
        <div
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-sm ${
            variant === 'large' ? 'px-10 py-20 text-xl' : ''
          }`}
          style={{
            backgroundColor: Colors.secondaryLight,
            color: Colors.textHighContrast,
          }}
        >
          {label}
        </div>
      )}

      {/* Contenedor de la imagen */}
      <div
        className={`relative mx-auto ${variant === 'compact' || variant === 'responsive' ? 'mt-[25px]' : 'mt-[70px]'} flex items-center justify-center rounded-md ${imageContainerStyles}`}
        style={{ backgroundColor: Colors.textWhite }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="Product Image"
            fill
            className="rounded-md object-contain"
          />
        ) : (
          <span style={{ color: Colors.textMain }}>Sin imagen</span>
        )}

        {variant === 'responsive' && (
          <div className="absolute bottom-2 right-2">
            <CartButton size="compact" />
          </div>
        )}

        {variant === 'compact' && (
          <div className="absolute bottom-2 right-2">
            <CartButton size="compact" />
          </div>
        )}
      </div>
      {/* Contenido dinámico */}
      {children}
    </div>
  );
};

export default CardBase;
