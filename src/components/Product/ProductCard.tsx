import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { Colors } from '@/styles/styles';

export type ImageType = string | StaticImageData;

export interface ProductCardProps {
  imageSrc?: ImageType;
  productName: string;
  stock: number;
  currentPrice: number;
  lastPrice?: number;
  discountPercentage?: number;
  label?: string;
  ribbonText?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  productName,
  stock,
  currentPrice,
  lastPrice,
  discountPercentage,
  label,
  ribbonText,
}) => {
  return (
    <div className="relative h-[610px] w-[351px] rounded-lg bg-white p-6 shadow-lg">
      {/* Ribbon SVG path que se extrajo del figma*/}
      {ribbonText && (
        <div
          className="absolute left-0 top-0 ml-[-1.2px] overflow-hidden"
          style={{ width: '97.73px', height: '97.2px' }}
        >
          <svg
            width="99"
            height="98"
            viewBox="0 0 99 98"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.0679756 91.5485C8.43593 95.0826 17.4044 96.9579 26.4803 97.0712C65.5363 97.5842 97.6122 66.1679 98.128 26.9013C98.2536 17.7761 96.6247 8.7127 93.331 0.209198L1.28367 -0.99991L0.0679756 91.5485Z"
              fill={Colors.ribbon}
            />
            <defs>
              <linearGradient
                id="paint0_linear_430_2720"
                x1="62.8389"
                y1="62.5382"
                x2="-56.9911"
                y2="-59.8155"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={Colors.ribbon} />
                <stop offset="1" stopColor={Colors.ribbon} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
            <span className="whitespace-pre-wrap text-center text-sm font-black text-white">
              {ribbonText.split(' ').join('\n')}
            </span>
          </div>
        </div>
      )}

      {label && (
        <div
          className="top-18 absolute right-2 mr-[20px] rounded-full px-3 py-1 py-[2px] text-sm"
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
        className="relative mx-auto mt-[70px] flex h-[249px] w-[249px] items-center justify-center rounded-md p-[60px]"
        style={{ backgroundColor: Colors.textWhite }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={productName}
            fill
            className="rounded-md object-contain"
          />
        ) : (
          <span style={{ color: Colors.textMain }}>Sin imagen</span>
        )}
      </div>

      {/* Información del producto */}
      <div className="mt-[10px] pl-[28px] text-left">
        <h2
          className="flex min-h-[50px] items-center text-lg font-semibold"
          style={{ color: Colors.textMain }}
        >
          {productName}
        </h2>

        <p className="mt-2 text-sm" style={{ color: Colors.textMain }}>
          Stock: {stock}
        </p>

        {/* Precios con etiqueta de descuento */}
        <div className="mt-4 flex items-center gap-2">
          {lastPrice && (
            <>
              <p
                className="text-medium line-through"
                style={{ color: Colors.textMain }}
              >
                ${lastPrice}
              </p>
              {discountPercentage !== undefined && (
                <span
                  className="rounded-md px-2 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: Colors.secondaryLight,
                    color: Colors.textHighContrast,
                  }}
                >
                  -{discountPercentage}%
                </span>
              )}
            </>
          )}
        </div>

        <p
          className="mt-1 text-xl font-medium"
          style={{ color: Colors.textMain }}
        >
          ${currentPrice}
        </p>
      </div>
    </div>
  );
};
